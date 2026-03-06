import { NotificationProvider } from "../types/NotificationProvider";
import { NotificationMessage } from "../domain/models";
import { NotificationResult } from "../types";
import { NotificationChannel, NotificationStatus } from "../domain/enums";

export class EmailProviderStub implements NotificationProvider {
    channel = NotificationChannel.EMAIL;
    name = "EmailStub";

    async send(message: NotificationMessage): Promise<NotificationResult> {
        if (!message.emailTarget) {
            throw new Error("No Email Target provided.");
        }

        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, 80));

        console.log(`[EmailProvider] Sent Email to ${message.emailTarget}: ${message.title}`);

        return {
            messageId: message.id,
            status: NotificationStatus.SENT,
            channelsDelivered: [NotificationChannel.EMAIL],
            channelsFailed: [],
        };
    }
}
