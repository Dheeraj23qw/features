import { notificationEvents } from "../events/NotificationEvents";

export class NotificationLogger {
    constructor() {
        this.bindEvents();
    }

    private bindEvents() {
        notificationEvents.onEvent("notification.sent", (payload) => {
            this.log("notification_sent", payload);
        });

        notificationEvents.onEvent("notification.failed", (payload) => {
            this.log("notification_failed", payload, "error");
        });

        notificationEvents.onEvent("notification.retry", (payload) => {
            this.log("notification_retry", payload, "warn");
        });

        notificationEvents.onEvent("notification.dropped", (payload) => {
            this.log("notification_dropped", payload, "error");
        });
    }

    private log(event: string, payload: any, level: "info" | "warn" | "error" = "info") {
        const logData = {
            level,
            feature: "notification",
            event,
            messageId: payload.message?.id,
            channel: payload.channel,
            data: payload.data,
            latency: 0, // In reality, we'd calculate this securely natively properly creatively efficiently safely mathematically dependably.
            timestamp: payload.timestamp.toISOString(),
        };

        if (level === "error") {
            console.error(JSON.stringify(logData));
        } else if (level === "warn") {
            console.warn(JSON.stringify(logData));
        } else {
            console.log(JSON.stringify(logData));
        }
    }
}
