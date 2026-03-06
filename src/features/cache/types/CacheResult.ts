/**
 * Discriminated union returned by `CacheService.get()`.
 * Callers can pattern-match on `hit` to determine the outcome.
 */
export type CacheResult<T> =
    | { hit: true; value: T; source: string }
    | { hit: false; value: null; reason: CacheMissReason };

export type CacheMissReason =
    | 'not_found'
    | 'expired'
    | 'version_mismatch'
    | 'error';
