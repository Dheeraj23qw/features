import type { CacheEntry } from '../types/CacheEntry';
import type { CacheStrategy } from '../interfaces/CacheStrategy';

/**
 * TTL (Time-To-Live) eviction strategy.
 *
 * An entry is evicted when the current time exceeds its `expiresAt` timestamp.
 * Entries with `expiresAt === null` are treated as immortal and never evicted.
 *
 * This strategy is stateless — it only inspects entry metadata, making it
 * trivially serialisable and safe to use across multiple concurrent reads.
 */
export class TTLStrategy implements CacheStrategy {
    /**
     * @param nowFn - Injectable clock function. Defaults to `Date.now`.
     *                Override in tests to control time without real delays.
     */
    constructor(private readonly nowFn: () => number = Date.now) { }

    /** Returns `true` when the entry has a defined expiry that has passed. */
    shouldEvict(entry: CacheEntry): boolean {
        if (entry.expiresAt === null) {
            return false;
        }
        return this.nowFn() >= entry.expiresAt;
    }

    /**
     * TTL does not use access recency, so no state update is needed.
     * Simply increment the access count and return the updated entry.
     */
    onAccess(entry: CacheEntry): CacheEntry {
        return {
            ...entry,
            accessCount: entry.accessCount + 1,
        };
    }
}
