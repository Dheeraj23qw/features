import { RateLimitStore } from "../types";

// Stub implementation ensuring interface mappings match before injecting actual ioredis client.
export class RedisStore implements RateLimitStore {
    async get(key: string): Promise<number> {
        console.warn(`[RedisStore] get(${key}) stub called. Use true redis client mapping in production.`);
        return 0;
    }

    async increment(key: string, amount: number = 1): Promise<number> {
        console.warn(`[RedisStore] increment(${key}, ${amount}) stub called. Use true redis client mapping.`);
        return amount;
    }

    async reset(key: string): Promise<void> {
        console.warn(`[RedisStore] reset(${key}) stub called.`);
    }
}
