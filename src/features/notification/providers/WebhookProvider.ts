import { NotificationProvider } from "../types/NotificationProvider";
import { NotificationMessage } from "../domain/models";
import { NotificationResult } from "../types";
import { NotificationChannel, NotificationStatus } from "../domain/enums";

export class WebhookProviderStub implements NotificationProvider {
    channel = NotificationChannel.WEBHOOK;
    name = "WebhookStub";

    async send(message: NotificationMessage): Promise<NotificationResult> {
        if (!message.webhookUrl) {
            throw new Error("No webhookUrl target provided.");
        }

        await new Promise(resolve => setTimeout(resolve, 150));
        console.log(`[WebhookProvider] Fired POST payload to ${message.webhookUrl}`);

        return {
            messageId: message.id,
            status: NotificationStatus.SENT,
            channelsDelivered: [NotificationChannel.WEBHOOK],
            channelsFailed: [],
        };
    }
}
