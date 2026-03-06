import { NotificationProvider } from "../types/NotificationProvider";
import { NotificationMessage } from "../domain/models";
import { NotificationResult } from "../types";
import { NotificationChannel, NotificationStatus } from "../domain/enums";

export class PushProviderStub implements NotificationProvider {
    channel = NotificationChannel.PUSH;
    name = "PushStub";

    async send(message: NotificationMessage): Promise<NotificationResult> {
        if (!message.pushToken) {
            throw new Error("No Push Token provided.");
        }

        await new Promise(resolve => setTimeout(resolve, 20));
        console.log(`[PushProvider] Pushed to device ${message.pushToken}: ${message.title}`);

        return {
            messageId: message.id,
            status: NotificationStatus.SENT,
            channelsDelivered: [NotificationChannel.PUSH],
            channelsFailed: [],
        };
    }
}
