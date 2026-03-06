/**
 * Serializer abstraction — responsible for converting values to and from
 * string representations suitable for storage.
 *
 * Swap implementations to support custom encodings (e.g. MessagePack, CBOR)
 * without touching the rest of the cache stack.
 */
export interface CacheSerializer {
    /**
     * Convert an arbitrary value to a string for persistence.
     * @throws `CacheError` (SERIALIZATION_FAILED) when conversion fails.
     */
    serialize(value: unknown): string;

    /**
     * Parse a persisted string back to its original type.
     * @throws `CacheError` (DESERIALIZATION_FAILED) when conversion fails.
     */
    deserialize<T>(value: string): T;
}
