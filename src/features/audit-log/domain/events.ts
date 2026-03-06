import { EventEmitter } from "events";
import { AuditEvent, AuditSeverity } from "./models";

export interface AuditLoggedEvent {
  event: AuditEvent;
}

export interface AuditFailedEvent {
  error: Error;
  attemptedEvent: Partial<AuditEvent>;
}

export interface AuditQueryEvent {
  filter: Record<string, unknown>;
  resultCount: number;
}

export class AuditEvents extends EventEmitter {
  private static instance: AuditEvents;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): AuditEvents {
    if (!AuditEvents.instance) {
      AuditEvents.instance = new AuditEvents();
    }
    return AuditEvents.instance;
  }

  emitLogged(event: AuditEvent): boolean {
    return this.emit("audit.logged", { event } as AuditLoggedEvent);
  }

  emitFailed(error: Error, attemptedEvent: Partial<AuditEvent>): boolean {
    return this.emit("audit.failed", { error, attemptedEvent } as AuditFailedEvent);
  }

  emitQuery(filter: Record<string, unknown>, resultCount: number): boolean {
    return this.emit("audit.query", { filter, resultCount } as AuditQueryEvent);
  }

  onLogged(listener: (data: AuditLoggedEvent) => void): void {
    this.on("audit.logged", listener);
  }

  onFailed(listener: (data: AuditFailedEvent) => void): void {
    this.on("audit.failed", listener);
  }

  onQuery(listener: (data: AuditQueryEvent) => void): void {
    this.on("audit.query", listener);
  }

  offLogged(listener: (data: AuditLoggedEvent) => void): void {
    this.off("audit.logged", listener);
  }

  offFailed(listener: (data: AuditFailedEvent) => void): void {
    this.off("audit.failed", listener);
  }

  offQuery(listener: (data: AuditQueryEvent) => void): void {
    this.off("audit.query", listener);
  }
}

export const auditEvents = AuditEvents.getInstance();
