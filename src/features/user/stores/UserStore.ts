import { randomUUID } from "crypto";
import type { User } from "../domain/models";
import type { UserRole, UserStatus } from "../domain/enums";

// ── Interface ──────────────────────────────────────────────────────────────
export interface UserStore {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(filters?: { role?: UserRole; status?: UserStatus }): Promise<User[]>;
    create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
    update(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<User>;
    softDelete(id: string): Promise<void>;
    count(): Promise<number>;
}

// ── In-Memory Implementation ───────────────────────────────────────────────
export class MemoryUserStore implements UserStore {
    private users = new Map<string, User>();

    async findById(id: string) { return this.users.get(id) ?? null; }

    async findByEmail(email: string) {
        for (const u of this.users.values()) {
            if (u.email.toLowerCase() === email.toLowerCase()) return u;
        }
        return null;
    }

    async findByUsername(username: string) {
        for (const u of this.users.values()) {
            if (u.username?.toLowerCase() === username.toLowerCase()) return u;
        }
        return null;
    }

    async findAll(filters?: { role?: UserRole; status?: UserStatus }) {
        let users = [...this.users.values()];
        if (filters?.role) users = users.filter(u => u.role === filters.role);
        if (filters?.status) users = users.filter(u => u.status === filters.status);
        return users;
    }

    async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        const now = new Date();
        const user: User = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
        this.users.set(user.id, user);
        return user;
    }

    async update(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
        const user = this.users.get(id);
        if (!user) throw new Error(`User ${id} not found.`);
        const updated: User = { ...user, ...data, updatedAt: new Date() };
        this.users.set(id, updated);
        return updated;
    }

    async softDelete(id: string): Promise<void> {
        const { UserStatus } = await import("../domain/enums");
        await this.update(id, { status: UserStatus.DELETED });
    }

    async count() { return this.users.size; }
}
