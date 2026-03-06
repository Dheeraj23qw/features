import { UserEvents, type UserEventType } from "../events/UserEvents";

export class UserLogger {
    constructor() {
        this.initialize();
    }

    private initialize() {
        const events: UserEventType[] = [
            "user.created",
            "user.updated",
            "user.deleted",
            "user.role_changed",
            "user.profile_updated",
            "user.preferences_updated",
            "user.suspended",
            "user.activated",
        ];

        events.forEach(event => {
            UserEvents.on(event, (payload) => {
                const logEntry = {
                    level: event === "user.deleted" || event === "user.suspended" ? "warn" : "info",
                    module: "user",
                    event,
                    userId: payload.userId,
                    changes: payload.changes ?? null,
                    actorId: payload.actorId ?? null,
                    timestamp: payload.timestamp?.toISOString(),
                };
                if (logEntry.level === "warn") {
                    console.warn(JSON.stringify(logEntry));
                } else {
                    console.log(JSON.stringify(logEntry));
                }
            });
        });
    }
}

// Auto-initialize
new UserLogger();
