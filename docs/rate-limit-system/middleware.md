# Next.js Middleware Interceptor

The rate limiter provides a middleware wrapper for Next.js route handlers.

## Basic Usage

```typescript
import { rateLimit } from "@/features/rate-limit";

const limiter = rateLimit({ key: "ip", limit: 50, windowMs: 60000 });

export async function POST(req) {
   return limiter(req, async () => { 
     // Your route logic here
   });
}
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `key` | string | Rate limit identifier (ip, userId, etc.) |
| `limit` | number | Max requests per window |
| `windowMs` | number | Window duration in milliseconds |
| `strategy` | string | Algorithm (fixed, sliding, token-bucket) |
| `skipIf` | function | Callback to bypass rate limiting |

## Fail-Open Protocol

If Redis becomes unavailable, the middleware catches the error and allows the request through rather than blocking:

```typescript
try {
  return await limiter(req, handler);
} catch (error) {
  // Fail-open: allow request through
  return handler(req);
}
```

This prevents a Redis outage from causing complete API failure.
