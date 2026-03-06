import { EventEmitter } from "events";
import { NotificationMessage } from "../domain/models";
import { NotificationChannel } from "../domain/enums";

class NotificationEventEmitter extends EventEmitter {
    emitEvent(eventName: string, message: NotificationMessage, channel?: NotificationChannel, data?: any) {
        this.emit(eventName, { message, channel, data, timestamp: new Date() });
    }

    onEvent(eventName: string, listener: (payload: any) => void) {
        this.on(eventName, listener);
    }
}

export const notificationEvents = new NotificationEventEmitter();

export class NotificationEvents {
    emit(eventName: string, message: NotificationMessage, channel?: NotificationChannel, data?: any) {
        notificationEvents.emitEvent(eventName, message, channel, data);
    }
}
