import { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitStrategy } from "../types";

export class FixedWindowStrategy implements RateLimitStrategy {
    constructor(private store: RateLimitStore) { }

    async consume(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
        const windowMs = config.window * 1000;
        const now = Date.now();

        // Create a time-bucketed key (e.g. "ip:192.168.1.1:1678886400000")
        const windowStart = Math.floor(now / windowMs) * windowMs;
        const bucketKey = `fixed_window:${key}:${windowStart}`;

        const currentCount = await this.store.increment(bucketKey, 1);

        const allowed = currentCount <= config.limit;
        const remaining = Math.max(0, config.limit - currentCount);
        const resetTime = windowStart + windowMs;

        return {
            allowed,
            remaining,
            resetTime,
            limit: config.limit,
        };
    }
}
