import { RateLimitStore } from "../types";

export class MemoryStore implements RateLimitStore {
    private store = new Map<string, { count: number; expiresAt: number }>();

    // Clean up stale entries every 60 seconds natively to prevent memory leaks globally.
    constructor() {
        setInterval(() => this.cleanup(), 60000).unref();
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, value] of this.store.entries()) {
            if (value.expiresAt < now) {
                this.store.delete(key);
            }
        }
    }

    async get(key: string): Promise<number> {
        const entry = this.store.get(key);
        if (!entry) return 0;

        if (entry.expiresAt < Date.now()) {
            this.store.delete(key);
            return 0;
        }

        return entry.count;
    }

    async increment(key: string, amount: number = 1): Promise<number> {
        const entry = this.store.get(key);

        // Default expiration is 1 hour if not reset manually by strategies.
        // Real expiration constraints are enforced within the strategy classes.
        const expiresAt = entry ? entry.expiresAt : Date.now() + 3600000;
        const newCount = (entry ? entry.count : 0) + amount;

        this.store.set(key, { count: newCount, expiresAt });
        return newCount;
    }

    async reset(key: string): Promise<void> {
        this.store.delete(key);
    }
}
