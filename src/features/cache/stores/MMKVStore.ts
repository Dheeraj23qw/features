import type { CacheStore } from '../interfaces/CacheStore';
import type { CacheEntry } from '../types/CacheEntry';
import type { CacheSerializer } from '../interfaces/CacheSerializer';
import { CacheError } from '../errors/CacheError';
import { serialize } from '../utils/serialize';
import { deserialize } from '../utils/deserialize';

// ---------------------------------------------------------------------------
// MMKV adapter interface
// ---------------------------------------------------------------------------
// We define a minimal interface matching react-native-mmkv so that this store
// remains framework-agnostic: inject any object that satisfies `MMKVAdapter`.
// In practice you would inject `new MMKV({ id: 'cache' })` from the app layer.

export interface MMKVAdapter {
    getString(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    clearAll(): void;
    getAllKeys(): string[];
}

/**
 * Persistent cache store backed by MMKV.
 *
 * MMKV provides synchronous, memory-mapped key-value storage optimised for
 * mobile apps (iOS / Android). This store wraps the MMKV adapter behind the
 * generic `CacheStore` interface so the rest of the cache stack never imports
 * MMKV directly (Dependency Inversion Principle).
 *
 * Serialisation is delegated to a `CacheSerializer` — defaults to JSON but
 * can be replaced with any implementation (e.g. MessagePack).
 */
export class MMKVStore implements CacheStore {
    readonly name = 'MMKVStore';

    private readonly serializer: CacheSerializer;

    constructor(
        private readonly mmkv: MMKVAdapter,
        serializer?: CacheSerializer,
    ) {
        this.serializer = serializer ?? {
            serialize,
            deserialize,
        };
    }

    async get(key: string): Promise<CacheEntry | null> {
        try {
            const raw = this.mmkv.getString(key);
            if (raw === undefined) return null;
            return this.serializer.deserialize<CacheEntry>(raw);
        } catch (err) {
            // Fail open — surface as CacheError but don't crash the app.
            throw CacheError.from('STORE_READ_FAILED', `${this.name}.get(${key})`, err);
        }
    }

    async set(entry: CacheEntry): Promise<void> {
        try {
            const raw = this.serializer.serialize(entry);
            this.mmkv.set(entry.key, raw);
        } catch (err) {
            throw CacheError.from('STORE_WRITE_FAILED', `${this.name}.set(${entry.key})`, err);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            this.mmkv.delete(key);
        } catch (err) {
            throw CacheError.from('STORE_DELETE_FAILED', `${this.name}.delete(${key})`, err);
        }
    }

    async clear(): Promise<void> {
        try {
            this.mmkv.clearAll();
        } catch (err) {
            throw CacheError.from('STORE_CLEAR_FAILED', `${this.name}.clear()`, err);
        }
    }

    async keys(): Promise<string[]> {
        try {
            return this.mmkv.getAllKeys();
        } catch {
            return [];
        }
    }
}
