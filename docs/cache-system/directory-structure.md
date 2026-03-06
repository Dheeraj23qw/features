# Directory Structure

```text
src/features/cache/
├── types/
│   ├── CacheEntry.ts           # Core data model (key, value, expiresAt, tags …)
│   ├── CacheOptions.ts         # set() options: ttl, tags, version, priority
│   └── CacheResult.ts          # Discriminated union: hit/miss + reason
│
├── interfaces/
│   ├── CacheStore.ts           # Persistence abstraction (get/set/delete/clear/keys)
│   ├── CacheStrategy.ts        # Eviction abstraction (shouldEvict/onAccess/onSet)
│   └── CacheSerializer.ts      # Serialisation abstraction (serialize/deserialize)
│
├── errors/
│   └── CacheError.ts           # Typed error class + CacheErrorCode union
│
├── utils/
│   ├── hashKey.ts              # djb2 key hashing — object keys → stable string
│   ├── serialize.ts            # JSON.stringify wrapper with typed error
│   └── deserialize.ts          # JSON.parse wrapper with typed error
│
├── strategies/
│   ├── TTLStrategy.ts          # Stateless time-based expiration
│   └── LRUCacheStrategy.ts     # Ordered-Map LRU with O(1) access tracking
│
├── stores/
│   ├── MemoryStore.ts          # L1 — in-process Map, ephemeral
│   ├── MMKVStore.ts            # L2 — MMKV via injectable MMKVAdapter
│   └── SQLiteStore.ts          # L3 — SQLite via injectable SQLiteAdapter
│
├── services/
│   └── CacheService.ts         # Central orchestrator — waterfall, promotion, tags
│
└── index.ts                    # ← The ONLY public boundary
```
