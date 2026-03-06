# Overview

The Cache Feature Module (`src/features/cache/`) provides a unified, framework-agnostic caching layer for any application. It manages in-memory and persistent storage, expiration, eviction, tag-based invalidation, and tier promotion — all behind clean interfaces.

## Responsibilities

| Responsibility | Owner |
|---|---|
| In-process fast lookup (L1) | `MemoryStore` |
| Persistent mobile storage (L2) | `MMKVStore` |
| Persistent relational storage (L3) | `SQLiteStore` |
| Expiration and eviction decisions | `TTLStrategy` / `LRUCacheStrategy` |
| Multi-store orchestration | `CacheService` |
| Tag-based group invalidation | `CacheService.invalidateTag()` |
| Background maintenance | `CacheService.cleanupExpired()` / `cleanupLRU()` |
| Developer diagnostics | `CacheService.inspect()` / `stats()` |

## Design Principles

- **Fail-open** — cache failures never crash the app; `get()` returns `null` on any error.
- **Store-agnostic** — `CacheStore` is an interface. Swap `MemoryStore` → any adapter with zero changes outside the store layer.
- **Strategy-injectable** — pass `TTLStrategy` or `LRUCacheStrategy` at construction time; build your own by implementing `CacheStrategy`.
- **Framework-independent** — no React, Expo, or any framework import exists inside the module. Works in Node.js, React Native, or a browser.
- **Strict public boundary** — only `index.ts` exports are visible to consuming code.
