/**
 * Cache Feature Module — Public API
 *
 * This barrel exports every symbol that consumers need.
 * Internal implementation details (e.g. store internals) are NOT re-exported.
 *
 * Usage:
 *   import { CacheService, MemoryStore, TTLStrategy } from '@/features/cache';
 */

// --- Types -------------------------------------------------------------------
export type { CacheEntry } from './types/CacheEntry';
export type { CacheOptions } from './types/CacheOptions';
export type { CacheResult, CacheMissReason } from './types/CacheResult';

// --- Interfaces --------------------------------------------------------------
export type { CacheStore } from './interfaces/CacheStore';
export type { CacheStrategy } from './interfaces/CacheStrategy';
export type { CacheSerializer } from './interfaces/CacheSerializer';

// --- Errors ------------------------------------------------------------------
export { CacheError } from './errors/CacheError';
export type { CacheErrorCode } from './errors/CacheError';

// --- Stores ------------------------------------------------------------------
export { MemoryStore } from './stores/MemoryStore';
export { MMKVStore } from './stores/MMKVStore';
export type { MMKVAdapter } from './stores/MMKVStore';
export { SQLiteStore } from './stores/SQLiteStore';
export type { SQLiteAdapter } from './stores/SQLiteStore';

// --- Strategies --------------------------------------------------------------
export { TTLStrategy } from './strategies/TTLStrategy';
export { LRUCacheStrategy } from './strategies/LRUCacheStrategy';

// --- Service -----------------------------------------------------------------
export { CacheService } from './services/CacheService';
export type { CacheServiceConfig } from './services/CacheService';

// --- Utilities ---------------------------------------------------------------
export { hashKey } from './utils/hashKey';
export { serialize } from './utils/serialize';
export { deserialize } from './utils/deserialize';
