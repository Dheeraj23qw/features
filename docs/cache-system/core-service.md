# CacheService

`CacheService` is the single orchestration point for the cache module. It wires together stores, a strategy, and all advanced features behind a clean, unified API.

## Construction

```typescript
import {
  CacheService,
  MemoryStore,
  MMKVStore,
  SQLiteStore,
  TTLStrategy,
  LRUCacheStrategy,
} from '@/features/cache';

const cache = new CacheService({
  stores: [
    new MemoryStore(),          // L1 — fastest, ephemeral
    new MMKVStore(mmkvInstance), // L2 — persistent, fast
    new SQLiteStore(sqliteAdapter), // L3 — persistent, large
  ],
  strategy: new TTLStrategy(),   // or new LRUCacheStrategy(500)
  defaultVersion: 1,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `stores` | `CacheStore[]` | required | Ordered tiers, highest priority first |
| `strategy` | `CacheStrategy` | `TTLStrategy` | Injectable eviction strategy |
| `defaultVersion` | `number` | `1` | Applied to all entries unless overridden per-call |

---

## Core API

### `get<T>(key, version?): Promise<CacheResult<T>>`

Waterfall lookup across all stores. Returns a typed discriminated union.

```typescript
const result = await cache.get<UserProfile>('user_profile');

if (result.hit) {
  console.log(result.value);   // UserProfile
  console.log(result.source);  // e.g. 'MemoryStore'
} else {
  console.log(result.reason);  // 'not_found' | 'expired' | 'version_mismatch'
}
```

### `set<T>(key, value, options?): Promise<void>`

Write to all stores concurrently. Partial store failures are tolerated.

```typescript
await cache.set('user_profile', profile, {
  ttl: 3600,
  tags: ['user', 'profile'],
  version: 2,
});
```

### `delete(key): Promise<void>`

Remove a single entry from all stores.

```typescript
await cache.delete('user_profile');
```

### `invalidateTag(tag): Promise<void>`

Scan all stores and delete every entry carrying the given tag.

```typescript
await cache.invalidateTag('user');      // clears all user-tagged entries
await cache.invalidateTag('product');   // clears all product-tagged entries
```

### `clear(): Promise<void>`

Wipe all entries from all stores.

```typescript
await cache.clear();
```

---

## Developer Utilities

### `inspect(key): Promise<InspectResult>`

Read a raw entry without updating access metadata — safe for debugging.

```typescript
const info = await cache.inspect('user_profile');
// {
//   key: 'user_profile',
//   foundInStore: 'MMKVStore',
//   entry: CacheEntry | null,
//   isExpired: false,
// }
```

### `stats(): Promise<CacheStats>`

Returns per-store key lists and a total unique key count.

```typescript
const stats = await cache.stats();
// {
//   stores: [
//     { name: 'MemoryStore',  keys: ['user_profile'] },
//     { name: 'MMKVStore',    keys: ['user_profile', 'settings'] },
//     { name: 'SQLiteStore',  keys: ['user_profile', 'settings', 'feed'] },
//   ],
//   totalKeys: 3,
// }
```

### `clearMemory(): Promise<void>`

Evict only the L1 memory store while preserving all persistent tiers.

```typescript
await cache.clearMemory(); // keeps MMKVStore + SQLiteStore intact
```

---

## Background Maintenance

Call these on app resume, on a timer, or from a background worker.

### `cleanupExpired(): Promise<void>`

Sweep all stores and delete every entry whose TTL has elapsed.

```typescript
// On app foreground
AppState.addEventListener('change', async (state) => {
  if (state === 'active') await cache.cleanupExpired();
});
```

### `cleanupLRU(): Promise<void>`

Evict keys from the LRU queue until the store size is within `maxSize`.
No-op when using `TTLStrategy`.

```typescript
await cache.cleanupLRU();
```
