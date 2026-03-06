import type { CacheStore } from '../interfaces/CacheStore';
import type { CacheStrategy } from '../interfaces/CacheStrategy';
import type { CacheEntry } from '../types/CacheEntry';
import type { CacheOptions } from '../types/CacheOptions';
import type { CacheResult } from '../types/CacheResult';
import { TTLStrategy } from '../strategies/TTLStrategy';
import { LRUCacheStrategy } from '../strategies/LRUCacheStrategy';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface CacheServiceConfig {
    /**
     * Ordered list of stores, highest priority first.
     * Lookup: first store that returns a hit wins.
     * On a tier miss, the found value is promoted to all higher-priority stores.
     *
     * Example: [new MemoryStore(), new MMKVStore(), new SQLiteStore()]
     */
    stores: CacheStore[];

    /**
     * Eviction strategy injected into the service.
     * Defaults to `TTLStrategy` when omitted.
     */
    strategy?: CacheStrategy;

    /**
     * Default version applied to all entries unless overridden per-set call.
     * Defaults to 1.
     */
    defaultVersion?: number;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

interface InspectResult {
    key: string;
    foundInStore: string | null;
    entry: CacheEntry | null;
    isExpired: boolean;
}

interface CacheStats {
    stores: Array<{ name: string; keys: string[] }>;
    totalKeys: number;
}

// ---------------------------------------------------------------------------
// CacheService
// ---------------------------------------------------------------------------

/**
 * Central orchestration layer for the cache module.
 *
 * Responsibilities:
 *  - Unified `get / set / delete / clear / invalidateTag` API.
 *  - Multi-store waterfall lookup with automatic tier promotion.
 *  - Expiration enforcement via the injected `CacheStrategy`.
 *  - Tag-based group invalidation.
 *  - Developer utilities (`inspect`, `stats`, `clearMemory`).
 *  - Background maintenance (`cleanupExpired`, `cleanupLRU`).
 *  - Fail-open: all errors are caught; `get` returns `null` on failure.
 *
 * No React / Expo / framework imports — pure TypeScript.
 */
export class CacheService {
    private readonly stores: CacheStore[];
    private readonly strategy: CacheStrategy;
    private readonly defaultVersion: number;

    constructor(config: CacheServiceConfig) {
        if (!config.stores || config.stores.length === 0) {
            throw new Error('[CacheService] At least one CacheStore must be provided.');
        }
        this.stores = config.stores;
        this.strategy = config.strategy ?? new TTLStrategy();
        this.defaultVersion = config.defaultVersion ?? 1;
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Retrieve a cached value by key.
     *
     * Lookup waterfall (stores in priority order):
     *  1. Check each store sequentially.
     *  2. If found — check expiry via strategy; evict if stale.
     *  3. If still valid — promote to all higher-priority stores.
     *  4. Return typed `CacheResult`.
     *
     * Always returns a `CacheResult` — never throws.
     */
    async get<T>(key: string, version?: number): Promise<CacheResult<T>> {
        const targetVersion = version ?? this.defaultVersion;

        for (let i = 0; i < this.stores.length; i++) {
            const store = this.stores[i]!;
            let entry: CacheEntry | null = null;

            try {
                entry = await store.get(key);
            } catch {
                // Store read failed → fail open, try next tier.
                continue;
            }

            if (!entry) continue;

            // Version mismatch — treat as stale.
            if (entry.version !== targetVersion) {
                await this.safeDelete(store, key);
                return { hit: false, value: null, reason: 'version_mismatch' };
            }

            // Expiration check.
            if (this.strategy.shouldEvict(entry)) {
                await this.safeDelete(store, key);
                return { hit: false, value: null, reason: 'expired' };
            }

            // Update access metadata.
            const updated = this.strategy.onAccess(entry);
            await this.safeSet(store, updated);

            // Promote to higher-priority stores (tier < i).
            await this.promote(updated, i);

            return {
                hit: true,
                value: updated.value as T,
                source: store.name,
            };
        }

        return { hit: false, value: null, reason: 'not_found' };
    }

    /**
     * Store a value in ALL configured stores.
     *
     * @param key     - Cache key (use `hashKey()` for object keys).
     * @param value   - Any serialisable value.
     * @param options - TTL, tags, version, priority.
     */
    async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
        const now = Date.now();
        const version = options.version ?? this.defaultVersion;
        const expiresAt =
            options.ttl != null ? now + options.ttl * 1000 : null;

        const entry: CacheEntry = {
            key,
            value,
            createdAt: now,
            expiresAt,
            accessCount: 0,
            tags: options.tags ?? [],
            version,
        };

        // Notify strategy of new entry (LRU tracking).
        this.strategy.onSet?.(entry);

        // Write to all stores concurrently (best-effort).
        await Promise.allSettled(
            this.stores.map((store) => this.safeSet(store, entry)),
        );
    }

    /**
     * Remove a single entry from all stores.
     */
    async delete(key: string): Promise<void> {
        await Promise.allSettled(
            this.stores.map((store) => this.safeDelete(store, key)),
        );
    }

    /**
     * Invalidate ALL entries that are tagged with the given tag.
     */
    async invalidateTag(tag: string): Promise<void> {
        for (const store of this.stores) {
            try {
                const allKeys = await store.keys();
                await Promise.allSettled(
                    allKeys.map(async (key) => {
                        const entry = await store.get(key);
                        if (entry?.tags.includes(tag)) {
                            await this.safeDelete(store, key);
                        }
                    }),
                );
            } catch {
                // Fail open — continue to next store.
            }
        }
    }

    /**
     * Remove ALL entries from all stores.
     */
    async clear(): Promise<void> {
        await Promise.allSettled(this.stores.map((store) => store.clear()));
    }

    // -------------------------------------------------------------------------
    // Developer Utilities
    // -------------------------------------------------------------------------

    /**
     * Inspect a key across all stores without updating access metadata.
     */
    async inspect(key: string): Promise<InspectResult> {
        for (const store of this.stores) {
            try {
                const entry = await store.get(key);
                if (entry) {
                    return {
                        key,
                        foundInStore: store.name,
                        entry,
                        isExpired: this.strategy.shouldEvict(entry),
                    };
                }
            } catch {
                // Try next store.
            }
        }
        return { key, foundInStore: null, entry: null, isExpired: false };
    }

    /**
     * Return key counts for each store — useful for monitoring dashboards.
     */
    async stats(): Promise<CacheStats> {
        const storeStats = await Promise.all(
            this.stores.map(async (store) => {
                try {
                    const keys = await store.keys();
                    return { name: store.name, keys };
                } catch {
                    return { name: store.name, keys: [] };
                }
            }),
        );

        const totalKeys = new Set(storeStats.flatMap((s) => s.keys)).size;
        return { stores: storeStats, totalKeys };
    }

    /**
     * Clear only the first (memory) store — preserves persistent tiers.
     */
    async clearMemory(): Promise<void> {
        const memoryStore = this.stores[0];
        if (memoryStore) {
            await memoryStore.clear();
        }
    }

    // -------------------------------------------------------------------------
    // Background Maintenance
    // -------------------------------------------------------------------------

    /**
     * Scan all stores and delete every entry whose TTL has passed.
     * Intended to be called periodically (e.g. on app resume or from a worker).
     */
    async cleanupExpired(): Promise<void> {
        for (const store of this.stores) {
            try {
                const keys = await store.keys();
                await Promise.allSettled(
                    keys.map(async (key) => {
                        const entry = await store.get(key);
                        if (entry && this.strategy.shouldEvict(entry)) {
                            await this.safeDelete(store, key);
                        }
                    }),
                );
            } catch {
                // Fail open.
            }
        }
    }

    /**
     * Evict using the strategy's LRU ordering until the eviction queue is empty.
     * Only meaningful when an `LRUCacheStrategy` is injected.
     */
    async cleanupLRU(): Promise<void> {
        if (!('nextEvictionKey' in this.strategy)) return;

        const lru = this.strategy as LRUCacheStrategy;
        let key = lru.nextEvictionKey();

        while (key !== null) {
            await this.delete(key);
            lru.remove(key);
            key = lru.nextEvictionKey();
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Promote an entry to all stores with index < `foundAt`.
     * Silently swallows errors — promotion is best-effort.
     */
    private async promote(entry: CacheEntry, foundAt: number): Promise<void> {
        if (foundAt === 0) return; // Already in the highest-priority store.

        const higherStores = this.stores.slice(0, foundAt);
        await Promise.allSettled(
            higherStores.map((store) => this.safeSet(store, entry)),
        );
    }

    private async safeSet(store: CacheStore, entry: CacheEntry): Promise<void> {
        try {
            await store.set(entry);
        } catch {
            // Fail open.
        }
    }

    private async safeDelete(store: CacheStore, key: string): Promise<void> {
        try {
            await store.delete(key);
        } catch {
            // Fail open.
        }
    }
}
