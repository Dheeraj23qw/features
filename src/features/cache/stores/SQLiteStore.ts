import type { CacheStore } from '../interfaces/CacheStore';
import type { CacheEntry } from '../types/CacheEntry';
import type { CacheSerializer } from '../interfaces/CacheSerializer';
import { CacheError } from '../errors/CacheError';
import { serialize } from '../utils/serialize';
import { deserialize } from '../utils/deserialize';

// ---------------------------------------------------------------------------
// SQLite adapter interface
// ---------------------------------------------------------------------------
// Defines the minimal surface area needed from any SQLite driver.
// Compatible with `expo-sqlite`, `better-sqlite3`, `react-native-sqlite-storage`,
// or any other driver — just wrap it in a thin adapter.

export interface SQLiteAdapter {
    /**
     * Execute a query that returns rows.
     * Each row is a plain object whose keys are column names.
     */
    execute<TRow extends Record<string, unknown>>(
        sql: string,
        params?: unknown[],
    ): Promise<{ rows: TRow[] }>;

    /** Execute a query that does not return rows (INSERT / UPDATE / DELETE). */
    run(sql: string, params?: unknown[]): Promise<void>;
}

const TABLE = 'cache_entries';

/**
 * SQLite-backed persistent cache store.
 *
 * Stores each `CacheEntry` as a serialised blob in a single table.
 * Framework-agnostic: depends only on the `SQLiteAdapter` interface above,
 * not on any specific SQLite library.
 *
 * Call `init()` once at startup to ensure the table exists.
 */
export class SQLiteStore implements CacheStore {
    readonly name = 'SQLiteStore';

    private readonly serializer: CacheSerializer;

    constructor(
        private readonly db: SQLiteAdapter,
        serializer?: CacheSerializer,
    ) {
        this.serializer = serializer ?? {
            serialize,
            deserialize,
        };
    }

    /**
     * Create the cache table if it does not already exist.
     * Must be called once before any other operations.
     */
    async init(): Promise<void> {
        await this.db.run(`
      CREATE TABLE IF NOT EXISTS ${TABLE} (
        key  TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      )
    `);
    }

    async get(key: string): Promise<CacheEntry | null> {
        try {
            const result = await this.db.execute<{ data: string }>(
                `SELECT data FROM ${TABLE} WHERE key = ?`,
                [key],
            );
            const row = result.rows[0];
            if (!row) return null;
            return this.serializer.deserialize<CacheEntry>(row.data);
        } catch (err) {
            throw CacheError.from('STORE_READ_FAILED', `${this.name}.get(${key})`, err);
        }
    }

    async set(entry: CacheEntry): Promise<void> {
        try {
            const data = this.serializer.serialize(entry);
            await this.db.run(
                `INSERT INTO ${TABLE} (key, data)
         VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET data = excluded.data`,
                [entry.key, data],
            );
        } catch (err) {
            throw CacheError.from('STORE_WRITE_FAILED', `${this.name}.set(${entry.key})`, err);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.db.run(`DELETE FROM ${TABLE} WHERE key = ?`, [key]);
        } catch (err) {
            throw CacheError.from('STORE_DELETE_FAILED', `${this.name}.delete(${key})`, err);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.db.run(`DELETE FROM ${TABLE}`);
        } catch (err) {
            throw CacheError.from('STORE_CLEAR_FAILED', `${this.name}.clear()`, err);
        }
    }

    async keys(): Promise<string[]> {
        try {
            const result = await this.db.execute<{ key: string }>(
                `SELECT key FROM ${TABLE}`,
            );
            return result.rows.map((r) => r.key);
        } catch {
            return [];
        }
    }
}
