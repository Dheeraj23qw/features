# Domain Models

## CacheEntry
The fundamental unit stored in every cache tier.

```typescript
interface CacheEntry<T = unknown> {
  key: string;          // Unique cache key
  value: T;             // Raw or serialised value
  createdAt: number;    // Unix ms timestamp at creation
  expiresAt: number | null; // Unix ms expiry; null = immortal
  accessCount: number;  // Read count (used by LRU strategy)
  tags: readonly string[]; // Group labels for invalidateTag()
  version: number;      // Schema version; mismatches treated as stale
}
```

## CacheOptions
Options passed to `cache.set()`.

```typescript
interface CacheOptions {
  ttl?: number;      // Seconds until expiry (omit = no expiry)
  tags?: string[];   // Tags for group invalidation
  version?: number;  // Schema version; defaults to 1
  priority?: number; // Eviction priority 1–10; defaults to 5
}
```

## CacheResult
Discriminated union returned by `cache.get()`. Always check `hit` before reading `value`.

```typescript
type CacheResult<T> =
  | { hit: true;  value: T;    source: string }
  | { hit: false; value: null; reason: CacheMissReason };

type CacheMissReason =
  | 'not_found'
  | 'expired'
  | 'version_mismatch'
  | 'error';
```

## CacheError

```typescript
class CacheError extends Error {
  code: CacheErrorCode; // 'STORE_READ_FAILED' | 'SERIALIZATION_FAILED' | …
  cause: unknown;
}
```

| Code | When |
|------|------|
| `SERIALIZATION_FAILED` | `serialize()` threw |
| `DESERIALIZATION_FAILED` | `deserialize()` threw |
| `STORE_READ_FAILED` | store `get()` threw |
| `STORE_WRITE_FAILED` | store `set()` threw |
| `STORE_DELETE_FAILED` | store `delete()` threw |
| `STORE_CLEAR_FAILED` | store `clear()` threw |
| `UNKNOWN` | unclassified error |
