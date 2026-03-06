import type { UserPreferences } from "../domain/models";

// ── Interface ──────────────────────────────────────────────────────────────
export interface PreferenceStore {
    findByUserId(userId: string): Promise<UserPreferences | null>;
    upsert(prefs: UserPreferences): Promise<UserPreferences>;
    delete(userId: string): Promise<void>;
}

// ── In-Memory Implementation ───────────────────────────────────────────────
export class MemoryPreferenceStore implements PreferenceStore {
    private prefs = new Map<string, UserPreferences>();

    async findByUserId(userId: string) { return this.prefs.get(userId) ?? null; }

    async upsert(prefs: UserPreferences): Promise<UserPreferences> {
        const existing = this.prefs.get(prefs.userId) ?? {};
        const merged: UserPreferences = { ...existing, ...prefs };
        this.prefs.set(prefs.userId, merged);
        return merged;
    }

    async delete(userId: string) { this.prefs.delete(userId); }
}
