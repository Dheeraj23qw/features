# Domain Models

The rate limiter uses strict domain boundaries to prevent configuration leaks.

## RateLimitConfig

Configuration for rate limit behavior.

```typescript
export interface RateLimitConfig {
  key: string;              // Rate limit key (e.g., "ip", "userId")
  limit: number;            // Maximum requests allowed
  window: number;           // Time window in milliseconds
  burst?: number;           // Token bucket burst capacity
}
```

## RateLimitResult

Result returned after checking rate limit.

```typescript
export interface RateLimitResult {
  allowed: boolean;     // True if request is allowed
  remaining: number;      // Remaining requests in window
  resetTime: number;      // Epoch timestamp when window resets
  limit: number;          // Total limit for this window
}
```

## Interfaces

### RateLimitStore

```typescript
interface RateLimitStore {
  increment(key: string, amount: number): Promise<number>;
  get(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}
```

### RateLimitStrategy

```typescript
interface RateLimitStrategy {
  consume(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}
```
