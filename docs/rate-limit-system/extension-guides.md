# Extension Guides

## Custom Error Handling

Override the default 429 response with a custom redirect or response:

```typescript
const limiter = rateLimit({
  key: "ip",
  limit: 50,
  onRateLimitExceeded: (req, error) => {
     return NextResponse.redirect(new URL("/rate-limited", req.url));
  }
});
```

## Custom Strategies

Implement a new throttling algorithm by implementing the strategy interface:

```typescript
export class CustomBurstStrategy implements RateLimitStrategy {
  async consume(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    // Custom algorithm implementation
    const count = await store.increment(key);
    return {
      allowed: count <= config.limit,
      remaining: Math.max(0, config.limit - count),
      resetTime: Date.now() + config.window,
      limit: config.limit
    };
  }
}
```

## Custom Key Generator

Create a custom key function:

```typescript
const limiter = rateLimit({
  keyGenerator: (req) => {
    return `rl:${req.headers.get("x-api-key")}`;
  }
});
```
