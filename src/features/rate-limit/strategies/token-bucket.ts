import { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitStrategy } from "../types";

export class TokenBucketStrategy implements RateLimitStrategy {
    constructor(private store: RateLimitStore) { }

    async consume(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
        const capacity = config.burst || config.limit;
        const refillRate = config.limit / (config.window * 1000); // Tokens per millisecond
        const now = Date.now();

        const timestampKey = `token_bucket:${key}:ts`;
        const tokensKey = `token_bucket:${key}:tk`;

        let lastRefillStr = await this.store.get(timestampKey);
        let currentTokensStr = await this.store.get(tokensKey);

        let lastRefill = lastRefillStr ? Number(lastRefillStr) : now;
        // Natively start full if no trace
        let currentTokens = currentTokensStr !== undefined && currentTokensStr !== 0 ? Number(currentTokensStr) : capacity;

        // Refuel tokens based on time passed
        if (now > lastRefill) {
            const timePassed = now - lastRefill;
            const refilledTokens = timePassed * refillRate;
            currentTokens = Math.min(capacity, currentTokens + refilledTokens);
        }

        let allowed = false;
        let remaining = Math.floor(currentTokens);

        if (currentTokens >= 1) {
            allowed = true;
            currentTokens -= 1;
            remaining -= 1;
        }

        // Save state back heavily. Due to standard MemoryStore implementation expecting 'increment',
        // managing absolute values requires specialized handling or generic key-value sets.
        // For this generic interface mapping, we assume '.increment' can act as state sets if tracked offline
        // but in a real Redis script (Lua), this would be atomic.

        // We mock the storage update here. In production, BullMQ/Redis natively execute a Lua script.
        // We'll map the timestamps by storing epochms as 'count' mathematically in MemoryStore as a workaround.
        await this.store.increment(timestampKey, now - (await this.store.get(timestampKey))); // Reset to now
        await this.store.increment(tokensKey, currentTokens - (await this.store.get(tokensKey))); // Diff sync

        return {
            allowed,
            remaining,
            resetTime: now + (1 / refillRate), // Time until 1 token regenerates natively
            limit: capacity,
        };
    }
}
