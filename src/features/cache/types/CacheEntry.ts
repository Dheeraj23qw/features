/**
 * Represents a single cached item stored in a CacheStore.
 * Immutable by design — create new entries rather than mutating.
 */
export interface CacheEntry<T = unknown> {
    /** Unique cache key */
    readonly key: string;

    /** The serialized (string) or raw value stored */
    readonly value: T;

    /** Timestamp (ms) when the entry was originally created */
    readonly createdAt: number;

    /**
     * Timestamp (ms) after which the entry is considered expired.
     * `null` means the entry never expires.
     */
    readonly expiresAt: number | null;

    /** Number of times this entry has been read */
    readonly accessCount: number;

    /** Optional tags for group-based invalidation */
    readonly tags: readonly string[];

    /**
     * Optional version number — mismatched versions are treated as stale.
     * Defaults to 1.
     */
    readonly version: number;
}
