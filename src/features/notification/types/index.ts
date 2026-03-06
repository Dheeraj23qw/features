import { NotificationMessage } from "../domain/models";
import { NotificationChannel, NotificationStatus } from "../domain/enums";

export interface NotificationPayload extends Omit<NotificationMessage, "id"> {
    // Payload is what the external API users submit (lacking ID and native state arrays)
    idempotencyKey?: string;
}

export interface NotificationResult {
    messageId: string;
    status: NotificationStatus;
    channelsDelivered: NotificationChannel[];
    channelsFailed: NotificationChannel[];
    error?: string;
    latency_ms?: number;
}
