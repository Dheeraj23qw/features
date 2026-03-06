import { EventEmitter } from "events";
import { EmailMessage, EmailResult } from "../domain/models";

export type EmailEvent =
    | "email.sent"
    | "email.failed"
    | "email.retry"
    | "email.bounced"
    | "email.opened"
    | "email.clicked";

export interface EmailEventPayload {
    message: EmailMessage;
    result?: EmailResult;
    error?: Error;
    attempt?: number;
    provider?: string;
}

class EmailEventEmitter extends EventEmitter {
    emitEvent(event: EmailEvent, payload: EmailEventPayload) {
        this.emit(event, payload);
    }

    onEvent(event: EmailEvent, listener: (payload: EmailEventPayload) => void) {
        this.on(event, listener);
    }
}

export const emailEvents = new EmailEventEmitter();
