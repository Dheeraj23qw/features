import { NotificationMessage } from "../domain/models";
import { NotificationStore } from "./MemoryNotificationStore";

// Stub implementation ensuring interface mappings match before injecting actual ioredis client.
export class RedisNotificationStore implements NotificationStore {
    async save(message: NotificationMessage): Promise<void> {
        console.warn(`[RedisNotificationStore] save(${message.id}) stub called.`);
    }

    async get(id: string): Promise<NotificationMessage | null> {
        console.warn(`[RedisNotificationStore] get(${id}) stub called.`);
        return null;
    }

    async delete(id: string): Promise<void> {
        console.warn(`[RedisNotificationStore] delete(${id}) stub called.`);
    }

    async listPending(): Promise<NotificationMessage[]> {
        console.warn(`[RedisNotificationStore] listPending() stub called.`);
        return [];
    }
}
