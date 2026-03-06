# Core Orchestration Service

The `RateLimitService` orchestrates rate limit configuration, storage, and strategy execution.

## Initialization

The service validates configuration on startup using Zod schemas:

```typescript
const { RATE_LIMIT_STORE, RATE_LIMIT_DEFAULT_STRATEGY } = getRateLimitConfig();
```

## Bypass Execution

The service supports conditional bypass logic via the `.skipIf()` option:

```typescript
const skip = await Promise.resolve(request.skipIf());
if (skip) {
  return { allowed: true, remaining: 9999, reset: Date.now() + windowMs };
}
```

## Service Interface

```typescript
interface RateLimitService {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  increment(key: string, windowMs: number): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}
```

## Result Structure

```typescript
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}
```
