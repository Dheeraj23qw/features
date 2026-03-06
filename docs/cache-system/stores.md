# Stores

Cache stores implement the `CacheStore` interface and are responsible **only for persistence** — no eviction or expiration logic lives inside a store.

## CacheStore Interface

```typescript
interface CacheStore {
  readonly name: string;
  get(key: string): Promise<CacheEntry | null>;
  set(entry: CacheEntry): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}
```

---

## MemoryStore — L1

Zero-dependency in-process store backed by a plain `Map`.

| Property | Value |
|----------|-------|
| Persistence | Ephemeral (lost on restart) |
| Performance | Synchronous under the hood; O(1) Map ops |
| Dependencies | None |
| Use as | Fastest tier, always slot first in `stores[]` |

```typescript
import { MemoryStore } from '@/features/cache';

const store = new MemoryStore();
console.log(store.size); // entry count
```

---

## MMKVStore — L2

Persistent store for React Native apps, backed by MMKV via an injected adapter.

| Property | Value |
|----------|-------|
| Persistence | Survives app restarts |
| Performance | Memory-mapped I/O, ~10× faster than AsyncStorage |
| Dependencies | Adapter only — inject `new MMKV(...)` from the app layer |
| Use as | L2 mobile persistence tier |

**MMKVAdapter interface** (satisfies `react-native-mmkv` out of the box):

```typescript
interface MMKVAdapter {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
  clearAll(): void;
  getAllKeys(): string[];
}
```

**Wiring in a React Native app:**

```typescript
import { MMKV } from 'react-native-mmkv';
import { MMKVStore } from '@/features/cache';

const store = new MMKVStore(new MMKV({ id: 'app-cache' }));
```

---

## SQLiteStore — L3

Persistent relational store backed by SQLite via an injected adapter.

| Property | Value |
|----------|-------|
| Persistence | Survives app restarts; durable across installs |
| Performance | Async disk I/O — slower than MMKV but unlimited size |
| Dependencies | Adapter only — wrap `expo-sqlite`, `better-sqlite3`, etc. |
| Use as | L3 fallback / long-lived persistent tier |

**SQLiteAdapter interface:**

```typescript
interface SQLiteAdapter {
  execute<TRow>(sql: string, params?: unknown[]): Promise<{ rows: TRow[] }>;
  run(sql: string, params?: unknown[]): Promise<void>;
}
```

**Wiring with expo-sqlite:**

```typescript
import * as SQLite from 'expo-sqlite';
import { SQLiteStore } from '@/features/cache';

const db = await SQLite.openDatabaseAsync('cache.db');

const adapter: SQLiteAdapter = {
  execute: async (sql, params) => ({
    rows: await db.getAllAsync(sql, params ?? []) as Record<string, unknown>[],
  }),
  run: (sql, params) => db.runAsync(sql, params ?? []),
};

const store = new SQLiteStore(adapter);
await store.init(); // creates the table once
```

---

## Writing a Custom Store

Implement `CacheStore` and inject it into `CacheService`:

```typescript
class RedisStore implements CacheStore {
  readonly name = 'RedisStore';
  // … implement get / set / delete / clear / keys
}

const cache = new CacheService({
  stores: [new MemoryStore(), new RedisStore(redisClient)],
});
```
