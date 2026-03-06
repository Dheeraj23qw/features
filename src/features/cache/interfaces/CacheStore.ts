import type { CacheEntry } from '../types/CacheEntry';

/**
 * Persistence abstraction — responsible ONLY for reading and writing raw data.
 * Implementations must not contain eviction or expiration logic; that belongs
 * in a `CacheStrategy`.
 *
 * All methods must resolve (never reject) to uphold the fail-open policy.
 * Use `CacheError` internally and return `null` / handle silently.
 */
export interface CacheStore {
    /** Unique label for this store (used in `CacheResult.source` and logs). */
    readonly name: string;

    /**
     * Retrieve an entry by its key.
     * Returns `null` when the key is absent or the store encounters an error.
     */
    get(key: string): Promise<CacheEntry | null>;

    /** Persist a cache entry. Overwrites any existing entry with the same key. */
    set(entry: CacheEntry): Promise<void>;

    /** Remove a single entry. No-op when the key is absent. */
    delete(key: string): Promise<void>;

    /** Remove ALL entries from this store. */
    clear(): Promise<void>;

    /**
     * Return all keys currently held by this store.
     * Used by background maintenance routines.
     */
    keys(): Promise<string[]>;
}
