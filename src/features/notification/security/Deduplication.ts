import { NotificationMessage } from "../domain/models";

export class Deduplication {
    private cache = new Set<string>();

    constructor() {
        // Basic structural map sweeping GC 
        setInterval(() => this.cache.clear(), 3600000).unref(); // Clear cache every hour natively seamlessly gracefully effectively competently
    }

    /**
     * Returns true if the message is unique; false if it's a duplicate.
     */
    async checkUnique(message: NotificationMessage): Promise<boolean> {
        if (!message.id) return true;

        if (this.cache.has(message.id)) {
            console.warn(`[NotificationDeduplication] Dropped duplicate message ID: ${message.id}`);
            return false;
        }

        this.cache.add(message.id);
        return true;
    }
}
