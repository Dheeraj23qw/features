# Extension Guides

The cache module is open for extension and closed for modification (Open/Closed Principle). Common extension points are documented below.

---

## Custom Store

Implement `CacheStore` to add any persistence backend — Redis, AsyncStorage, filesystem, etc.

```typescript
import type { CacheStore, CacheEntry } from '@/features/cache';

export class RedisStore implements CacheStore {
  readonly name = 'RedisStore';

  constructor(private readonly redis: RedisClient) {}

  async get(key: string): Promise<CacheEntry | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  }

  async set(entry: CacheEntry): Promise<void> {
    const ttlMs = entry.expiresAt ? entry.expiresAt - Date.now() : undefined;
    if (ttlMs !== undefined && ttlMs <= 0) return;
    const opts = ttlMs ? { PX: ttlMs } : {};
    await this.redis.set(entry.key, JSON.stringify(entry), opts);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clear(): Promise<void> {
    await this.redis.flushDb();
  }

  async keys(): Promise<string[]> {
    return this.redis.keys('*');
  }
}
```

Inject it as any other store:

```typescript
const cache = new CacheService({
  stores: [new MemoryStore(), new RedisStore(redisClient)],
});
```

---

## Custom Strategy

Implement `CacheStrategy` to add any eviction logic — sliding window, priority-based, segment-aware, etc.

```typescript
import type { CacheStrategy, CacheEntry } from '@/features/cache';

/** Never evict unless TTL is explicitly set and has passed. */
export class SlidingTTLStrategy implements CacheStrategy {
  private readonly windowMs: number;

  constructor(windowSeconds: number) {
    this.windowMs = windowSeconds * 1000;
  }

  shouldEvict(entry: CacheEntry): boolean {
    if (entry.expiresAt === null) return false;
    // Sliding: reset the window on access (see onAccess)
    return Date.now() >= entry.expiresAt;
  }

  onAccess(entry: CacheEntry): CacheEntry {
    // Extend the expiry each time the entry is read
    return {
      ...entry,
      accessCount: entry.accessCount + 1,
      expiresAt: Date.now() + this.windowMs,
    };
  }
}
```

---

## Custom Serializer

Implement `CacheSerializer` to swap JSON for a binary format (MessagePack, CBOR, etc.).

```typescript
import type { CacheSerializer } from '@/features/cache';
import { encode, decode } from '@msgpack/msgpack';

export class MessagePackSerializer implements CacheSerializer {
  serialize(value: unknown): string {
    return Buffer.from(encode(value)).toString('base64');
  }

  deserialize<T>(value: string): T {
    return decode(Buffer.from(value, 'base64')) as T;
  }
}
```

Inject it into MMKV or SQLite stores:

```typescript
const store = new MMKVStore(mmkvInstance, new MessagePackSerializer());
```

---

## Object Keys

Use `hashKey()` to derive stable string keys from structured inputs:

```typescript
import { hashKey } from '@/features/cache';

const key = hashKey({ userId: '42', page: 3, filter: 'active' });
// → 'obj:1a2b3c4d'

await cache.set(key, paginatedData, { ttl: 300, tags: ['feed'] });
```

---

## Tag-Scoped Invalidation

Tags allow group-level cache busting without knowing individual keys:

```typescript
// On user profile update — invalidate all user-scoped cache
await cache.invalidateTag('user');

// On product data change — bust product-related caches only
await cache.invalidateTag('products');

// Set multiple tags per entry
await cache.set('dashboard_stats', stats, {
  ttl: 60,
  tags: ['user', 'dashboard', 'analytics'],
});
```
