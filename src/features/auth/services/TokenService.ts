import { randomUUID } from "crypto";
import { TokenSigner } from "../security/TokenSigner";
import type { UserStore, TokenStore } from "../stores/index";
import type { AuthPayload } from "../types/index";
import { TokenType } from "../domain/enums";
import { getUserPermissions } from "../domain/permissions";
import { getAuthConfig } from "../utils/config";
import type { User } from "../domain/models";

export class TokenService {
    private signer: TokenSigner;

    constructor(private userStore: UserStore, private tokenStore: TokenStore) {
        this.signer = new TokenSigner();
    }

    issueAccessToken(user: User): string {
        const permissions = getUserPermissions(user.roles);
        const payload: Omit<AuthPayload, "iat" | "exp"> = {
            userId: user.id,
            email: user.email,
            roles: user.roles,
            permissions,
        };
        return this.signer.sign(payload);
    }

    async issueRefreshToken(userId: string): Promise<string> {
        const config = getAuthConfig();
        const token = randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + config.REFRESH_TOKEN_EXPIRES_DAYS);

        await this.tokenStore.save({
            id: randomUUID(),
            userId,
            token,
            type: TokenType.REFRESH,
            expiresAt,
        });
        return token;
    }

    async issueVerificationToken(userId: string): Promise<string> {
        const config = getAuthConfig();
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + config.EMAIL_TOKEN_EXPIRES_MINUTES * 60 * 1000);
        await this.tokenStore.deleteByUser(userId, TokenType.EMAIL_VERIFICATION);
        await this.tokenStore.save({ id: randomUUID(), userId, token, type: TokenType.EMAIL_VERIFICATION, expiresAt });
        return token;
    }

    async issuePasswordResetToken(userId: string): Promise<string> {
        const config = getAuthConfig();
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + config.EMAIL_TOKEN_EXPIRES_MINUTES * 60 * 1000);
        await this.tokenStore.deleteByUser(userId, TokenType.PASSWORD_RESET);
        await this.tokenStore.save({ id: randomUUID(), userId, token, type: TokenType.PASSWORD_RESET, expiresAt });
        return token;
    }

    verifyAccessToken(token: string): AuthPayload {
        return this.signer.verify(token);
    }

    async verifyRefreshToken(token: string) {
        return this.tokenStore.find(token, TokenType.REFRESH);
    }

    async verifyEmailToken(token: string) {
        return this.tokenStore.find(token, TokenType.EMAIL_VERIFICATION);
    }

    async verifyResetToken(token: string) {
        return this.tokenStore.find(token, TokenType.PASSWORD_RESET);
    }

    async consumeToken(id: string) {
        await this.tokenStore.markUsed(id);
    }
}
