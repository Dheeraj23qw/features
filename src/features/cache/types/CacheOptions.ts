/**
 * Options provided by the caller when writing to the cache.
 */
export interface CacheOptions {
    /**
     * Time-to-live in seconds. After this duration the entry is expired.
     * If omitted the entry lives indefinitely (no TTL).
     */
    ttl?: number;

    /**
     * Arbitrary tags associated with the entry.
     * Used for group invalidation via `CacheService.invalidateTag()`.
     */
    tags?: string[];

    /**
     * Cache schema version. Entries with a mismatched version are treated as stale
     * and will be re-fetched / overwritten.
     * Defaults to 1.
     */
    version?: number;

    /**
     * Eviction priority hint.
     * Higher value = keep longer under memory pressure (LRU eviction).
     * Range: 1 (lowest) – 10 (highest). Defaults to 5.
     */
    priority?: number;
}
