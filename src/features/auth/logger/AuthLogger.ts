import { AuthEvents, type AuthEventType } from "../events/AuthEvents";

export class AuthLogger {
    constructor() {
        this.initialize();
    }

    private initialize() {
        const events: AuthEventType[] = [
            "auth.register",
            "auth.login",
            "auth.logout",
            "auth.failed_login",
            "auth.password_reset",
            "auth.email_verified",
            "auth.mfa_challenge",
            "auth.token_refreshed",
        ];

        events.forEach(event => {
            AuthEvents.on(event, (payload) => {
                const logEntry = {
                    level: event === "auth.failed_login" ? "warn" : "info",
                    module: "auth",
                    event,
                    userId: payload.userId ?? null,
                    email: payload.email ?? null,
                    ip: payload.ip ?? null,
                    error: payload.error ?? null,
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
new AuthLogger();
