/**
 * Produces a stable, deterministic string key from any cache key input.
 *
 * For simple string keys the value is returned as-is (no overhead).
 * For objects / arrays a JSON-based hash is computed so that two structurally
 * identical objects produce the same cache key.
 *
 * This utility has zero external dependencies and works in every JS runtime.
 */

/**
 * Lightweight djb2 hash of a string → returns a hex string.
 * Fast and collision-resistant enough for in-process cache keys.
 */
function djb2(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    // >>> 0 converts to unsigned 32-bit integer
    // eslint-disable-next-line no-bitwise
    return (hash >>> 0).toString(16);
}

/**
 * Normalise and hash a cache key.
 *
 * @param key - A string or a JSON-serialisable object / array.
 * @returns   - A stable string suitable for use as a store key.
 *
 * @example
 * hashKey('user_profile')             // → 'user_profile'
 * hashKey({ userId: 42, page: 1 })   // → 'obj:a1b2c3d4'
 */
export function hashKey(key: string | Record<string, unknown> | unknown[]): string {
    if (typeof key === 'string') {
        return key;
    }

    try {
        // Sort object keys for deterministic serialisation.
        const normalised = JSON.stringify(key, Object.keys(
            key as Record<string, unknown>,
        ).sort());
        return `obj:${djb2(normalised)}`;
    } catch {
        // Fallback: convert to string representation.
        return `obj:${djb2(String(key))}`;
    }
}
