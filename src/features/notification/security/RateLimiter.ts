import { NotificationMessage } from "../domain/models";

export class RateLimiter {
    private cache = new Map<string, { count: number; expiresAt: number }>();
    private readonly MAX_PER_MINUTE = 50;

    constructor() {
        setInterval(() => this.cleanup(), 60000).unref();
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, val] of this.cache.entries()) {
            if (val.expiresAt < now) this.cache.delete(key);
        }
    }

    async checkLimit(message: NotificationMessage): Promise<boolean> {
        const key = `rl_${message.userId || "anonymous"}`;
        const now = Date.now();

        const entry = this.cache.get(key) || { count: 0, expiresAt: now + 60000 };
        if (entry.expiresAt < now) {
            entry.count = 0;
            entry.expiresAt = now + 60000;
        }

        entry.count++;
        this.cache.set(key, entry);

        if (entry.count > this.MAX_PER_MINUTE) {
            console.warn(`[NotificationRateLimiter] Rate limit exceeded for ${key}`);
            return false;
        }

        return true;
    }
}
