/**
 * All error codes emitted by the cache module.
 * Extend this union as new failure modes are discovered.
 */
export type CacheErrorCode =
    | 'SERIALIZATION_FAILED'
    | 'DESERIALIZATION_FAILED'
    | 'STORE_READ_FAILED'
    | 'STORE_WRITE_FAILED'
    | 'STORE_DELETE_FAILED'
    | 'STORE_CLEAR_FAILED'
    | 'UNKNOWN';

/**
 * Typed error class for all cache-related failures.
 *
 * Keeps cache errors clearly distinguishable from application errors
 * and carries structured metadata for logging / telemetry.
 */
export class CacheError extends Error {
    public readonly code: CacheErrorCode;
    public readonly cause: unknown;

    constructor(
        message: string,
        code: CacheErrorCode = 'UNKNOWN',
        cause?: unknown,
    ) {
        super(message);
        this.name = 'CacheError';
        this.code = code;
        this.cause = cause;

        // Restore the prototype chain (required when extending built-in classes).
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /** Wrap any arbitrary error in a CacheError for uniform handling. */
    static from(
        code: CacheErrorCode,
        label: string,
        cause: unknown,
    ): CacheError {
        const message =
            cause instanceof Error
                ? `Cache [${code}] — ${label}: ${cause.message}`
                : `Cache [${code}] — ${label}`;
        return new CacheError(message, code, cause);
    }
}
