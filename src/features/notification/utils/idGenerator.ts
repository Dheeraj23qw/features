import { randomUUID } from "crypto";

export const generateNotificationId = (idempotencyKey?: string): string => {
    if (idempotencyKey) {
        // In production, you might hash the idempotencyKey or prefix it. 
        return `notif_idemp_${idempotencyKey}`;
    }

    return `notif_${randomUUID().replace(/-/g, "")}`;
};
