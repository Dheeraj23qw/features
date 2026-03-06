import type { CacheStore } from '../interfaces/CacheStore';
import type { CacheEntry } from '../types/CacheEntry';
import { CacheError } from '../errors/CacheError';

/**
 * In-process memory store backed by a plain `Map`.
 *
 * - Zero dependencies, works in every JS runtime.
 * - Data is lost when the process restarts (ephemeral by design).
 * - Intended as the L1 (fastest) tier in a multi-store setup.
 * - Operations are synchronous internally but wrapped in Promises to satisfy
 *   the `CacheStore` contract.
 */
export class MemoryStore implements CacheStore {
    readonly name = 'MemoryStore';

    private readonly store = new Map<string, CacheEntry>();

    async get(key: string): Promise<CacheEntry | null> {
        try {
            return this.store.get(key) ?? null;
        } catch (err) {
            throw CacheError.from('STORE_READ_FAILED', `${this.name}.get(${key})`, err);
        }
    }

    async set(entry: CacheEntry): Promise<void> {
        try {
            this.store.set(entry.key, entry);
        } catch (err) {
            throw CacheError.from('STORE_WRITE_FAILED', `${this.name}.set(${entry.key})`, err);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            this.store.delete(key);
        } catch (err) {
            throw CacheError.from('STORE_DELETE_FAILED', `${this.name}.delete(${key})`, err);
        }
    }

    async clear(): Promise<void> {
        try {
            this.store.clear();
        } catch (err) {
            throw CacheError.from('STORE_CLEAR_FAILED', `${this.name}.clear()`, err);
        }
    }

    async keys(): Promise<string[]> {
        return Array.from(this.store.keys());
    }

    /** Convenience accessor — returns the current entry count. */
    get size(): number {
        return this.store.size;
    }
}
