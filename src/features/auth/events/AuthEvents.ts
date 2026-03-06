import { EventEmitter } from "events";

export type AuthEventType =
    | "auth.register"
    | "auth.login"
    | "auth.logout"
    | "auth.failed_login"
    | "auth.password_reset"
    | "auth.email_verified"
    | "auth.mfa_challenge"
    | "auth.token_refreshed";

interface AuthEventPayload {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    error?: string;
    timestamp: Date;
}

class AuthEventsEmitter extends EventEmitter {
    emit(event: AuthEventType, payload: AuthEventPayload): boolean {
        return super.emit(event, payload);
    }

    on(event: AuthEventType, listener: (payload: AuthEventPayload) => void): this {
        return super.on(event, listener);
    }

    emitEvent(event: AuthEventType, payload: Omit<AuthEventPayload, "timestamp">): void {
        this.emit(event, { ...payload, timestamp: new Date() });
    }
}

export const AuthEvents = new AuthEventsEmitter();
