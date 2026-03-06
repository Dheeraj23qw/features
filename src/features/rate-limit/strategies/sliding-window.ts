import { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitStrategy } from "../types";

export class SlidingWindowStrategy implements RateLimitStrategy {
    constructor(private store: RateLimitStore) { }

    async consume(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
        const windowMs = config.window * 1000;
        const now = Date.now();

        const currentWindowStart = Math.floor(now / windowMs) * windowMs;
        const previousWindowStart = currentWindowStart - windowMs;

        const currentKey = `sliding_window:${key}:${currentWindowStart}`;
        const previousKey = `sliding_window:${key}:${previousWindowStart}`;

        // Get previous window count (defaults 0 if expires natively in MemoryStore)
        const previousCount = await this.store.get(previousKey);
        const currentCount = await this.store.increment(currentKey, 1);

        // Calculate weight of previous window bleeding into current
        const timePassedInCurrentWindow = now - currentWindowStart;
        const weightOfPreviousWindow = 1 - (timePassedInCurrentWindow / windowMs);

        const estimatedRequests = Math.floor(previousCount * weightOfPreviousWindow) + currentCount;

        const allowed = estimatedRequests <= config.limit;
        const remaining = Math.max(0, config.limit - estimatedRequests);
        const resetTime = currentWindowStart + windowMs;

        // Optional: If allowed === false, we could revert the increment here to not penalize blocked requests
        // but standard sliding window log/counters often penalize blocked requests indefinitely. 
        // We will leave it penalizing per standard DOS mitigation.

        return {
            allowed,
            remaining,
            resetTime,
            limit: config.limit,
        };
    }
}
