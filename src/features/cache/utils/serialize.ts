import { CacheError } from '../errors/CacheError';

/**
 * Serialize an arbitrary value to a JSON string.
 *
 * Wraps `JSON.stringify` with a typed error so callers always receive
 * `CacheError` (SERIALIZATION_FAILED) rather than a plain `TypeError`.
 *
 * @param value - Any JSON-serialisable value.
 * @returns     - A JSON string.
 * @throws      - `CacheError` when serialisation fails.
 */
export function serialize(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch (err) {
        throw CacheError.from('SERIALIZATION_FAILED', 'serialize()', err);
    }
}
