import type { CacheEntry } from '../types/CacheEntry';
import type { CacheStrategy } from '../interfaces/CacheStrategy';

/**
 * LRU (Least-Recently-Used) eviction strategy.
 *
 * Tracks access order in an internal doubly-linked Map (O(1) ops).
 * When `nextEvictionKey()` is called the key accessed least recently is
 * returned. Respects TTL as well — an expired entry is always evicted first.
 *
 * The `maxSize` cap is advisory: `CacheService` calls `nextEvictionKey()` and
 * evicts one entry each time the cap would be exceeded by a `set()`.
 */
export class LRUCacheStrategy implements CacheStrategy {
    /** Ordered Map: oldest access at the front, newest at the back. */
    private readonly accessOrder: Map<string, number>;

    /**
     * @param maxSize - Maximum number of entries to retain. 0 = unlimited.
     * @param nowFn   - Injectable clock. Defaults to `Date.now`.
     */
    constructor(
        private readonly maxSize: number = 256,
        private readonly nowFn: () => number = Date.now,
    ) {
        this.accessOrder = new Map();
    }

    /** Evict if the entry has a passed TTL. LRU size-trimming is separate. */
    shouldEvict(entry: CacheEntry): boolean {
        if (entry.expiresAt !== null && this.nowFn() >= entry.expiresAt) {
            return true;
        }
        return false;
    }

    /**
     * Move the accessed key to the "most-recently-used" end of the map.
     * Returns the updated entry with an incremented access count.
     */
    onAccess(entry: CacheEntry): CacheEntry {
        this.touch(entry.key);
        return {
            ...entry,
            accessCount: entry.accessCount + 1,
        };
    }

    /** Register a new entry in the LRU order map. */
    onSet(entry: CacheEntry): void {
        this.touch(entry.key);
    }

    /**
     * Return the key that should be evicted next (the least-recently-used entry).
     * Returns `null` when the LRU map is empty or `maxSize` is unlimited.
     */
    nextEvictionKey(): string | null {
        if (this.maxSize === 0 || this.accessOrder.size === 0) {
            return null;
        }
        if (this.accessOrder.size <= this.maxSize) {
            return null;
        }
        // The first key in the Map is the least-recently-used.
        const [lruKey] = this.accessOrder.keys();
        return lruKey ?? null;
    }

    /** Remove a key from the tracking order (e.g. after deletion). */
    remove(key: string): void {
        this.accessOrder.delete(key);
    }

    /** Clear all tracked state. */
    reset(): void {
        this.accessOrder.clear();
    }

    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------

    private touch(key: string): void {
        // Delete and re-insert to move to the end (most-recently-used position).
        this.accessOrder.delete(key);
        this.accessOrder.set(key, this.nowFn());
    }
}
