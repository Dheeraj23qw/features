import type { UserProfile } from "../domain/models";

// ── Interface ──────────────────────────────────────────────────────────────
export interface ProfileStore {
    findByUserId(userId: string): Promise<UserProfile | null>;
    upsert(profile: UserProfile): Promise<UserProfile>;
    delete(userId: string): Promise<void>;
}

// ── In-Memory Implementation ───────────────────────────────────────────────
export class MemoryProfileStore implements ProfileStore {
    private profiles = new Map<string, UserProfile>();

    async findByUserId(userId: string) { return this.profiles.get(userId) ?? null; }

    async upsert(profile: UserProfile): Promise<UserProfile> {
        const existing = this.profiles.get(profile.userId) ?? {};
        const merged: UserProfile = { ...existing, ...profile };
        this.profiles.set(profile.userId, merged);
        return merged;
    }

    async delete(userId: string) { this.profiles.delete(userId); }
}
