# Storage Adapters

The rate limiter supports multiple storage backends through a pluggable adapter interface.

## 1. MemoryStore (Default)

Ideal for development, testing, and small-scale deployments.

- **Garbage Collection**: Runs every 60 seconds to clean expired entries
- **Storage**: In-memory `Map` data structure
- **Limitations**: Not suitable for multi-instance deployments

```typescript
export class MemoryStore implements RateLimitStore {
  private store = new Map<string, { count: number; expiresAt: number }>();
  
  async increment(key: string, amount = 1) {
    // Implementation
  }
}
```

## 2. RedisStore

Production-ready distributed storage for multi-instance deployments.

```typescript
import Redis from "ioredis";
const client = new Redis(process.env.REDIS_URL);

export class RedisStore implements RateLimitStore {
  async increment(key: string, amount = 1) {
    return await client.incrby(key, amount);
  }
}
```

## Configuration

Set storage backend via environment variable:
```bash
RATE_LIMIT_STORE=redis  # or "memory"
```

## Interface

```typescript
interface RateLimitStore {
  increment(key: string, amount: number): Promise<number>;
  get(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}
```
