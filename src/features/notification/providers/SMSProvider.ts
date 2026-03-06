import { NotificationProvider } from "../types/NotificationProvider";
import { NotificationMessage } from "../domain/models";
import { NotificationResult } from "../types";
import { NotificationChannel, NotificationStatus } from "../domain/enums";

export class SMSProviderStub implements NotificationProvider {
    channel = NotificationChannel.SMS;
    name = "SMSStub";

    async send(message: NotificationMessage): Promise<NotificationResult> {
        if (!message.phoneTarget) {
            throw new Error("No Phone Target provided for SMS.");
        }

        await new Promise(resolve => setTimeout(resolve, 50));
        console.log(`[SMSProvider] Sent SMS to ${message.phoneTarget}: ${message.body}`);

        return {
            messageId: message.id,
            status: NotificationStatus.SENT,
            channelsDelivered: [NotificationChannel.SMS],
            channelsFailed: [],
        };
    }
}
