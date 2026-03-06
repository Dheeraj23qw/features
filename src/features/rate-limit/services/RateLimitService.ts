import { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitStrategy } from "../types";
import { MemoryStore } from "../stores/memory.store";
import { RedisStore } from "../stores/redis.store";
import { FixedWindowStrategy } from "../strategies/fixed-window";
import { SlidingWindowStrategy } from "../strategies/sliding-window";
import { TokenBucketStrategy } from "../strategies/token-bucket";
import { getRateLimitConfig } from "../config/rateLimit.config";

export interface RateLimitRequest {
    key: string;
    config?: Partial<RateLimitConfig>;
    skipIf?: () => boolean | Promise<boolean>;
}

export class RateLimitService {
    private store: RateLimitStore;
    private strategies: Record<string, RateLimitStrategy>;
    private globalConfig = getRateLimitConfig();

    constructor() {
        this.store = this.globalConfig.RATE_LIMIT_STORE === "redis" ? new RedisStore() : new MemoryStore();

        this.strategies = {
            fixed: new FixedWindowStrategy(this.store),
            sliding: new SlidingWindowStrategy(this.store),
            token: new TokenBucketStrategy(this.store),
        };
    }

    private logEvent(event: string, key: string, payload?: any) {
        console.warn(JSON.stringify({
            level: "warn",
            feature: "rate-limit",
            timestamp: new Date().toISOString(),
            event,
            key,
            ...payload
        }));
    }

    /**
     * Main Orchestrator natively tracking usage.
     */
    async checkLimit(request: RateLimitRequest): Promise<RateLimitResult> {
        if (request.skipIf) {
            const skip = await Promise.resolve(request.skipIf());
            if (skip) {
                return { allowed: true, remaining: 9999, resetTime: Date.now(), limit: 9999 };
            }
        }

        const mergedConfig: RateLimitConfig = {
            key: request.key,
            limit: request.config?.limit ?? this.globalConfig.RATE_LIMIT_DEFAULT_LIMIT,
            window: request.config?.window ?? this.globalConfig.RATE_LIMIT_DEFAULT_WINDOW,
            burst: request.config?.burst,
        };

        const strategyName = this.globalConfig.RATE_LIMIT_DEFAULT_STRATEGY;
        const strategy = this.strategies[strategyName];

        if (!strategy) {
            throw new Error(`Strategy ${strategyName} not found.`);
        }

        const result = await strategy.consume(request.key, mergedConfig);

        if (!result.allowed) {
            this.logEvent("rate_limit_exceeded", request.key, { limit: result.limit, resetAt: result.resetTime });
        }

        return result;
    }
}

// Export Singleton natively
export const rateLimitService = new RateLimitService();
