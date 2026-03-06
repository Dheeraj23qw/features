import type { User } from "../domain/models";
import type { Session } from "../domain/models";
import type { StoredToken } from "../domain/models";
import { TokenType } from "../domain/enums";

// ── UserStore ──────────────────────────────────────────────────────────────
export interface UserStore {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
}

export class MemoryUserStore implements UserStore {
    private users = new Map<string, User>();

    async findById(id: string) { return this.users.get(id) ?? null; }

    async findByEmail(email: string) {
        for (const u of this.users.values()) {
            if (u.email.toLowerCase() === email.toLowerCase()) return u;
        }
        return null;
    }

    async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        const { randomUUID } = await import("crypto");
        const now = new Date();
        const user: User = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
        this.users.set(user.id, user);
        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = this.users.get(id);
        if (!user) throw new Error(`User ${id} not found`);
        const updated = { ...user, ...data, updatedAt: new Date() };
        this.users.set(id, updated);
        return updated;
    }

    async delete(id: string) { this.users.delete(id); }
}

// ── SessionStore ───────────────────────────────────────────────────────────
export interface SessionStore {
    create(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findByRefreshToken(token: string): Promise<Session | null>;
    findAllByUser(userId: string): Promise<Session[]>;
    revoke(id: string): Promise<void>;
    revokeAllByUser(userId: string): Promise<void>;
}

export class MemorySessionStore implements SessionStore {
    private sessions = new Map<string, Session>();

    async create(session: Session) { this.sessions.set(session.id, session); }
    async findById(id: string) { return this.sessions.get(id) ?? null; }

    async findByRefreshToken(token: string) {
        for (const s of this.sessions.values()) {
            if (s.refreshToken === token) return s;
        }
        return null;
    }

    async findAllByUser(userId: string) {
        return [...this.sessions.values()].filter(s => s.userId === userId);
    }

    async revoke(id: string) { this.sessions.delete(id); }

    async revokeAllByUser(userId: string) {
        for (const [id, s] of this.sessions) {
            if (s.userId === userId) this.sessions.delete(id);
        }
    }
}

// ── TokenStore ─────────────────────────────────────────────────────────────
export interface TokenStore {
    save(token: StoredToken): Promise<void>;
    find(token: string, type: TokenType): Promise<StoredToken | null>;
    markUsed(id: string): Promise<void>;
    deleteByUser(userId: string, type: TokenType): Promise<void>;
}

export class MemoryTokenStore implements TokenStore {
    private tokens = new Map<string, StoredToken>();

    async save(token: StoredToken) { this.tokens.set(token.id, token); }

    async find(token: string, type: TokenType) {
        for (const t of this.tokens.values()) {
            if (t.token === token && t.type === type && !t.usedAt && t.expiresAt > new Date()) return t;
        }
        return null;
    }

    async markUsed(id: string) {
        const t = this.tokens.get(id);
        if (t) this.tokens.set(id, { ...t, usedAt: new Date() });
    }

    async deleteByUser(userId: string, type: TokenType) {
        for (const [id, t] of this.tokens) {
            if (t.userId === userId && t.type === type) this.tokens.delete(id);
        }
    }
}
