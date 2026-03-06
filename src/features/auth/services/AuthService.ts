import { randomUUID } from "crypto";
import { PasswordService } from "./PasswordService";
import { TokenService } from "./TokenService";
import { SessionService } from "./SessionService";
import { MFAService } from "../security/MFAService";
import { BruteForceProtection } from "../security/BruteForceProtection";
import { OAuthStrategy } from "../strategies/OAuthStrategy";
import { GoogleProvider } from "../providers/GoogleProvider";
import { GitHubProvider } from "../providers/GitHubProvider";
import {
    MemoryUserStore,
    MemorySessionStore,
    MemoryTokenStore,
    type UserStore,
    type SessionStore,
    type TokenStore,
} from "../stores/index";
import { AuthEvents } from "../events/AuthEvents";
import type { AuthResult } from "../types/index";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "../utils/validators";
import {
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotFoundError,
    EmailNotVerifiedError,
    MFARequiredError,
    TokenInvalidError,
} from "../utils/errors";
import { UserStatus, MFAMethod } from "../domain/enums";
import { Role } from "../domain/permissions";

export class AuthService {
    private static instance: AuthService;

    private userStore: UserStore;
    private sessionStore: SessionStore;
    private tokenStore: TokenStore;
    private passwordService: PasswordService;
    private tokenService: TokenService;
    private sessionService: SessionService;
    private mfaService: MFAService;
    private bruteForce: BruteForceProtection;
    private oauthStrategy: OAuthStrategy;

    private constructor() {
        this.userStore = new MemoryUserStore();
        this.sessionStore = new MemorySessionStore();
        this.tokenStore = new MemoryTokenStore();
        this.passwordService = new PasswordService();
        this.tokenService = new TokenService(this.userStore, this.tokenStore);
        this.sessionService = new SessionService(this.sessionStore);
        this.mfaService = new MFAService();
        this.bruteForce = new BruteForceProtection();
        this.oauthStrategy = new OAuthStrategy();
        this.oauthStrategy.register(new GoogleProvider());
        this.oauthStrategy.register(new GitHubProvider());
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // ── Register ──────────────────────────────────────────────────────────────
    async register(input: RegisterInput, ip = "unknown", userAgent = "unknown"): Promise<AuthResult> {
        const existing = await this.userStore.findByEmail(input.email);
        if (existing) throw new UserAlreadyExistsError();

        const passwordHash = await this.passwordService.hashPassword(input.password);
        const user = await this.userStore.create({
            email: input.email,
            passwordHash,
            roles: [Role.USER],
            status: UserStatus.PENDING_VERIFICATION,
            isEmailVerified: false,
            mfaEnabled: false,
            oauthProviders: [],
        });

        const accessToken = this.tokenService.issueAccessToken(user);
        const refreshToken = await this.tokenService.issueRefreshToken(user.id);
        await this.sessionService.createSession(user.id, refreshToken, ip, userAgent);
        const verificationToken = await this.tokenService.issueVerificationToken(user.id);

        AuthEvents.emitEvent("auth.register", { userId: user.id, email: user.email, ip });
        // TODO: send verification email via email feature

        const { passwordHash: _, mfaSecret: __, ...safeUser } = user;
        return { accessToken, refreshToken, user: safeUser };
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    async login(input: LoginInput, ip = "unknown", userAgent = "unknown"): Promise<AuthResult> {
        this.bruteForce.check(input.email);

        const user = await this.userStore.findByEmail(input.email);
        if (!user || !user.passwordHash) {
            AuthEvents.emitEvent("auth.failed_login", { email: input.email, ip, error: "User not found" });
            this.bruteForce.recordFailure(input.email);
            throw new InvalidCredentialsError();
        }

        const valid = await this.passwordService.verifyPassword(input.password, user.passwordHash);
        if (!valid) {
            AuthEvents.emitEvent("auth.failed_login", { email: input.email, ip, error: "Wrong password" });
            this.bruteForce.recordFailure(input.email);
            throw new InvalidCredentialsError();
        }

        this.bruteForce.reset(input.email);

        // MFA challenge
        if (user.mfaEnabled) {
            if (!input.mfaCode) {
                AuthEvents.emitEvent("auth.mfa_challenge", { userId: user.id, email: user.email, ip });
                throw new MFARequiredError();
            }
            const validMFA =
                user.mfaMethod === MFAMethod.TOTP
                    ? this.mfaService.verifyTOTP(user.mfaSecret ?? "", input.mfaCode)
                    : this.mfaService.verifyEmailCode(user.id, input.mfaCode);
            if (!validMFA) throw new InvalidCredentialsError();
        }

        const accessToken = this.tokenService.issueAccessToken(user);
        const refreshToken = await this.tokenService.issueRefreshToken(user.id);
        await this.sessionService.createSession(user.id, refreshToken, ip, userAgent);

        AuthEvents.emitEvent("auth.login", { userId: user.id, email: user.email, ip });

        const { passwordHash: _, mfaSecret: __, ...safeUser } = user;
        return { accessToken, refreshToken, user: safeUser };
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    async logout(refreshToken: string): Promise<void> {
        const session = await this.sessionService.findByRefreshToken(refreshToken);
        if (session) {
            await this.sessionService.revokeSession(session.id);
            AuthEvents.emitEvent("auth.logout", { userId: session.userId });
        }
    }

    // ── Refresh Token ─────────────────────────────────────────────────────────
    async refreshToken(token: string, ip = "unknown", userAgent = "unknown"): Promise<AuthResult> {
        const stored = await this.tokenService.verifyRefreshToken(token);
        if (!stored) throw new TokenInvalidError();

        const user = await this.userStore.findById(stored.userId);
        if (!user) throw new UserNotFoundError();

        await this.tokenService.consumeToken(stored.id);
        await this.sessionService.findByRefreshToken(token).then(s => s && this.sessionService.revokeSession(s.id));

        const accessToken = this.tokenService.issueAccessToken(user);
        const newRefresh = await this.tokenService.issueRefreshToken(user.id);
        await this.sessionService.createSession(user.id, newRefresh, ip, userAgent);

        AuthEvents.emitEvent("auth.token_refreshed", { userId: user.id });

        const { passwordHash: _, mfaSecret: __, ...safeUser } = user;
        return { accessToken, refreshToken: newRefresh, user: safeUser };
    }

    // ── Verify Email ──────────────────────────────────────────────────────────
    async verifyEmail(token: string): Promise<void> {
        const stored = await this.tokenService.verifyEmailToken(token);
        if (!stored) throw new TokenInvalidError();

        await this.userStore.update(stored.userId, {
            isEmailVerified: true,
            status: UserStatus.ACTIVE,
        });
        await this.tokenService.consumeToken(stored.id);
        AuthEvents.emitEvent("auth.email_verified", { userId: stored.userId });
    }

    // ── Request Password Reset ────────────────────────────────────────────────
    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.userStore.findByEmail(email);
        if (!user) return; // Don't leak existence
        const resetToken = await this.tokenService.issuePasswordResetToken(user.id);
        AuthEvents.emitEvent("auth.password_reset", { userId: user.id, email: user.email });
        // TODO: send reset email via email feature with resetToken
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    async resetPassword(input: ResetPasswordInput): Promise<void> {
        const stored = await this.tokenService.verifyResetToken(input.token);
        if (!stored) throw new TokenInvalidError();

        const newHash = await this.passwordService.hashPassword(input.newPassword);
        await this.userStore.update(stored.userId, { passwordHash: newHash });
        await this.tokenService.consumeToken(stored.id);
        await this.sessionService.revokeAllSessions(stored.userId);
    }

    // ── OAuth Login ───────────────────────────────────────────────────────────
    async oauthLogin(providerType: string, code: string, ip = "unknown", userAgent = "unknown"): Promise<AuthResult> {
        const provider = this.oauthStrategy.getProvider(providerType);
        const profile = await provider.exchangeCode(code);

        let user = await this.userStore.findByEmail(profile.email);
        if (!user) {
            user = await this.userStore.create({
                email: profile.email,
                roles: [Role.USER],
                status: UserStatus.ACTIVE,
                isEmailVerified: true,
                mfaEnabled: false,
                oauthProviders: [providerType],
            });
        } else if (!user.oauthProviders.includes(providerType)) {
            user = await this.userStore.update(user.id, {
                oauthProviders: [...user.oauthProviders, providerType],
            });
        }

        const accessToken = this.tokenService.issueAccessToken(user);
        const refreshToken = await this.tokenService.issueRefreshToken(user.id);
        await this.sessionService.createSession(user.id, refreshToken, ip, userAgent);
        AuthEvents.emitEvent("auth.login", { userId: user.id, email: user.email, ip });

        const { passwordHash: _, mfaSecret: __, ...safeUser } = user;
        return { accessToken, refreshToken, user: safeUser };
    }

    // ── Get OAuth URL ─────────────────────────────────────────────────────────
    getOAuthUrl(providerType: string): string {
        const state = randomUUID();
        return this.oauthStrategy.getProvider(providerType).getAuthorizationUrl(state);
    }

    // ── Get Current User ──────────────────────────────────────────────────────
    async getCurrentUser(userId: string) {
        const user = await this.userStore.findById(userId);
        if (!user) throw new UserNotFoundError();
        const { passwordHash: _, mfaSecret: __, ...safeUser } = user;
        return safeUser;
    }
}
