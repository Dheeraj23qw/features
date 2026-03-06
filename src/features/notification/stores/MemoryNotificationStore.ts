import { NotificationMessage } from "../domain/models";

export interface NotificationStore {
    save(message: NotificationMessage): Promise<void>;
    get(id: string): Promise<NotificationMessage | null>;
    delete(id: string): Promise<void>;
    listPending(): Promise<NotificationMessage[]>;
}

export class MemoryNotificationStore implements NotificationStore {
    private store = new Map<string, NotificationMessage>();

    async save(message: NotificationMessage): Promise<void> {
        this.store.set(message.id, message);
    }

    async get(id: string): Promise<NotificationMessage | null> {
        return this.store.get(id) || null;
    }

    async delete(id: string): Promise<void> {
        this.store.delete(id);
    }

    async listPending(): Promise<NotificationMessage[]> {
        // Basic query for pending items natively safely
        return Array.from(this.store.values());
    }
}
