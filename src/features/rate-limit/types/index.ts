export interface RateLimitConfig {
    key: string;              // e.g. "ip", "user_123", "global"
    limit: number;            // e.g. 100 requests
    window: number;           // Time window in seconds
    burst?: number;           // Token bucket burst allowance
}

export interface RateLimitResult {
    allowed: boolean;         // True if request passed checks
    remaining: number;        // Tokens / requests permitted remaining
    resetTime: number;        // Epoch timestamp (ms) when window refills / clears
    limit: number;            // Total allowed capacity
}

export interface RateLimitStore {
    get(key: string): Promise<number>;
    increment(key: string, amount?: number): Promise<number>;
    reset(key: string): Promise<void>;
}

export interface RateLimitStrategy {
    consume(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}
