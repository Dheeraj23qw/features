import { NotificationMessage } from "../domain/models";
import { NotificationResult } from "../types";
import { NotificationChannel } from "../domain/enums";

export interface NotificationProvider {
    channel: NotificationChannel;
    name: string;
    send(message: NotificationMessage): Promise<NotificationResult>;
}
