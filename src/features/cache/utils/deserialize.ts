import { CacheError } from '../errors/CacheError';

/**
 * Deserialize a JSON string back to its original type `T`.
 *
 * Wraps `JSON.parse` with typed error handling so callers always receive
 * `CacheError` (DESERIALIZATION_FAILED) rather than a plain `SyntaxError`.
 *
 * @param value - A JSON string produced by `serialize()`.
 * @returns     - The parsed value cast to `T`.
 * @throws      - `CacheError` when parsing fails.
 */
export function deserialize<T>(value: string): T {
    try {
        return JSON.parse(value) as T;
    } catch (err) {
        throw CacheError.from('DESERIALIZATION_FAILED', 'deserialize()', err);
    }
}
