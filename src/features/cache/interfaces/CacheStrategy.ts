import type { CacheEntry } from '../types/CacheEntry';

/**
 * Strategy abstraction — handles expiration and eviction decisions.
 * Completely decoupled from persistence; works purely with `CacheEntry` metadata.
 *
 * Inject different strategies into `CacheService` to swap behaviour without
 * touching store implementations (Open/Closed Principle).
 */
export interface CacheStrategy {
    /**
     * Returns `true` when the given entry should be purged from the store.
     * Called by `CacheService` on every read and during background maintenance.
     */
    shouldEvict(entry: CacheEntry): boolean;

    /**
     * Hook called each time an entry is successfully read.
     * Strategies that track recency (LRU) use this to update internal state.
     * Return the (potentially mutated) entry to allow metadata updates.
     */
    onAccess(entry: CacheEntry): CacheEntry;

    /**
     * Optional: called when an entry is written to the store.
     * Allows strategies to register new entries for tracking (e.g. LRU queue).
     */
    onSet?(entry: CacheEntry): void;

    /**
     * Optional: return the key of the entry that should be evicted next
     * based on the strategy's ordering (e.g. least-recently-used).
     * Returns `null` when there is nothing to evict.
     */
    nextEvictionKey?(): string | null;
}
