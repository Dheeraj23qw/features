# Architecture

## System Diagram

```mermaid
flowchart TD
    Client((Client)) --> API(Public API: get / set / delete / invalidateTag / clear)

    subgraph Cache Service
        API --> CS[CacheService]
        CS --> Strategy[CacheStrategy\nTTL | LRU]
    end

    subgraph Store Waterfall
        CS --> MS[(MemoryStore\nL1 — in-process Map)]
        CS --> MK[(MMKVStore\nL2 — MMKV adapter)]
        CS --> SQ[(SQLiteStore\nL3 — SQLite adapter)]
    end

    subgraph Promotion
        SQ -. "tier miss → promote" .-> MK
        MK -. "tier miss → promote" .-> MS
    end
```

## Waterfall Lookup

On every `get()` call, stores are queried in priority order (L1 → L2 → L3):

1. **Hit on L1** — return immediately.
2. **Hit on L2 or L3** — entry is valid → promoted to all higher-priority stores, then returned.
3. **Miss on all stores** — return `{ hit: false, reason: 'not_found' }`.
4. **Expired hit** — entry is deleted from the store and `{ hit: false, reason: 'expired' }` is returned.

`set()` writes to **all** stores concurrently via `Promise.allSettled` — partial store failures are tolerated.

## Architectural Layers

1. **Type Layer (`types/`)** — Pure TypeScript interfaces for `CacheEntry`, `CacheOptions`, and `CacheResult`. Zero runtime code.
2. **Interface Layer (`interfaces/`)** — Three narrow contracts: `CacheStore`, `CacheStrategy`, `CacheSerializer`. Consumers depend on these, never on concrete classes.
3. **Error Layer (`errors/`)** — Typed `CacheError` with a fixed set of `CacheErrorCode` values for structured error handling.
4. **Utility Layer (`utils/`)** — Stateless helpers: `hashKey`, `serialize`, `deserialize`. No side effects.
5. **Strategy Layer (`strategies/`)** — Pluggable eviction rules. `TTLStrategy` is stateless. `LRUCacheStrategy` tracks recency via an ordered `Map`.
6. **Store Layer (`stores/`)** — Interface-driven persistence. MMKV and SQLite stores accept injected adapters — no library is imported directly.
7. **Service Layer (`services/CacheService.ts`)** — the single orchestration point. Wires stores, strategy, promotion, and tag invalidation.
