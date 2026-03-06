import { randomUUID } from "crypto";
import type { SessionStore } from "../stores/index";
import type { Session } from "../domain/models";
import { getAuthConfig } from "../utils/config";

export class SessionService {
    constructor(private sessionStore: SessionStore) { }

    async createSession(userId: string, refreshToken: string, ipAddress: string, userAgent: string): Promise<Session> {
        const config = getAuthConfig();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + config.REFRESH_TOKEN_EXPIRES_DAYS);

        const session: Session = {
            id: randomUUID(),
            userId,
            refreshToken,
            ipAddress,
            userAgent,
            createdAt: new Date(),
            expiresAt,
            lastUsedAt: new Date(),
        };

        await this.sessionStore.create(session);
        return session;
    }

    async validateSession(sessionId: string): Promise<Session | null> {
        const session = await this.sessionStore.findById(sessionId);
        if (!session || session.expiresAt < new Date()) {
            if (session) await this.sessionStore.revoke(session.id);
            return null;
        }
        return session;
    }

    async revokeSession(sessionId: string): Promise<void> {
        await this.sessionStore.revoke(sessionId);
    }

    async revokeAllSessions(userId: string): Promise<void> {
        await this.sessionStore.revokeAllByUser(userId);
    }

    async getUserSessions(userId: string): Promise<Omit<Session, "refreshToken">[]> {
        const sessions = await this.sessionStore.findAllByUser(userId);
        return sessions.map(({ refreshToken: _, ...rest }) => rest);
    }

    async findByRefreshToken(token: string): Promise<Session | null> {
        return this.sessionStore.findByRefreshToken(token);
    }
}
