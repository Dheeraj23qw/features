import { EventEmitter } from "events";

export type UserEventType =
    | "user.created"
    | "user.updated"
    | "user.deleted"
    | "user.role_changed"
    | "user.profile_updated"
    | "user.preferences_updated"
    | "user.suspended"
    | "user.activated";

interface UserEventPayload {
    userId: string;
    changes?: string[];
    actorId?: string;
    timestamp: Date;
}

class UserEventsEmitter extends EventEmitter {
    emit(event: UserEventType, payload: UserEventPayload): boolean {
        return super.emit(event, payload);
    }

    on(event: UserEventType, listener: (payload: UserEventPayload) => void): this {
        return super.on(event, listener);
    }

    emitEvent(event: UserEventType, payload: Omit<UserEventPayload, "timestamp">): void {
        this.emit(event, { ...payload, timestamp: new Date() });
    }
}

export const UserEvents = new UserEventsEmitter();
