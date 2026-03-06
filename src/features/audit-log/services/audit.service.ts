import { createHash, randomUUID } from "crypto";
import {
  AuditEvent,
  AuditEventInput,
  AuditFilter,
  AuditContext,
  ActorType,
  AuditSeverity,
  PaginatedAuditEvents,
} from "../domain/models";
import { AuditStore } from "../stores/audit.store";
import { auditEvents } from "../domain/events";

export interface AuditServiceOptions {
  store: AuditStore;
  enableHashChain?: boolean;
  enableTamperDetection?: boolean;
}

export class AuditService {
  private store: AuditStore;
  private enableHashChain: boolean;
  private enableTamperDetection: boolean;
  private lastEventHash: string | null = null;

  constructor(options: AuditServiceOptions) {
    this.store = options.store;
    this.enableHashChain = options.enableHashChain ?? true;
    this.enableTamperDetection = options.enableTamperDetection ?? true;
  }

  async initialize(): Promise<void> {
    if (this.enableHashChain) {
      const latest = await this.store.getLatest(1);
      this.lastEventHash = latest[0]?.eventHash || null;
    }
  }

  async log(input: AuditEventInput, context?: AuditContext): Promise<AuditEvent> {
    const event: AuditEvent = {
      eventId: randomUUID(),
      action: input.action,
      actorId: input.actorId,
      actorType: input.actorType || ActorType.USER,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      timestamp: new Date(),
      metadata: input.metadata,
      context: context,
      severity: this.determineSeverity(input.action),
      description: input.description,
      previousValue: input.previousValue,
      newValue: input.newValue,
    };

    if (this.enableHashChain && this.enableTamperDetection) {
      event.previousEventHash = this.lastEventHash || undefined;
      event.eventHash = this.computeEventHash(event);
      this.lastEventHash = event.eventHash;
    }

    try {
      await this.store.save(event);
      auditEvents.emitLogged(event);
      return event;
    } catch (error) {
      auditEvents.emitFailed(error as Error, event);
      throw error;
    }
  }

  async query(filter: AuditFilter): Promise<PaginatedAuditEvents> {
    const result = await this.store.find(filter);
    auditEvents.emitQuery(filter as unknown as Record<string, unknown>, result.total);
    return result;
  }

  async findByActor(actorId: string, limit?: number): Promise<AuditEvent[]> {
    return this.store.findByActor(actorId, limit);
  }

  async findByResource(
    resourceType: string,
    resourceId: string,
    limit?: number
  ): Promise<AuditEvent[]> {
    return this.store.findByResource(resourceType, resourceId, limit);
  }

  async findByAction(action: string, limit?: number): Promise<AuditEvent[]> {
    return this.store.findByAction(action, limit);
  }

  async getLatest(limit?: number): Promise<AuditEvent[]> {
    return this.store.getLatest(limit);
  }

  async verifyIntegrity(): Promise<{
    isValid: boolean;
    brokenChain: AuditEvent[];
  }> {
    if (!this.enableHashChain || !this.enableTamperDetection) {
      return { isValid: true, brokenChain: [] };
    }

    const events = await this.store.getLatest(1000);
    const brokenChain: AuditEvent[] = [];
    let previousHash: string | null = null;

    for (const event of events.reverse()) {
      if (previousHash && event.previousEventHash !== previousHash) {
        brokenChain.push(event);
      }
      previousHash = event.eventHash || null;
    }

    return {
      isValid: brokenChain.length === 0,
      brokenChain,
    };
  }

  private computeEventHash(event: AuditEvent): string {
    const data = [
      event.eventId,
      event.action,
      event.actorId,
      event.actorType,
      event.resourceType || "",
      event.resourceId || "",
      new Date(event.timestamp).toISOString(),
      event.previousEventHash || "",
    ].join("|");

    return createHash("sha256").update(data).digest("hex");
  }

  private determineSeverity(action: string): AuditSeverity {
    const criticalActions = [
      "USER_DELETED",
      "USER_SUSPENDED",
      "ROLE_ASSIGNED",
      "ROLE_REMOVED",
      "PERMISSION_GRANTED",
      "PERMISSION_REVOKED",
      "SYSTEM_CONFIG_CHANGED",
      "SUSPICIOUS_ACTIVITY",
      "INVALID_TOKEN",
    ];

    const warningActions = [
      "USER_LOGIN_FAILED",
      "RATE_LIMIT_EXCEEDED",
      "USER_PASSWORD_CHANGED",
      "USER_MFA_ENABLED",
      "USER_MFA_DISABLED",
    ];

    if (criticalActions.includes(action)) {
      return AuditSeverity.CRITICAL;
    }

    if (warningActions.includes(action)) {
      return AuditSeverity.WARNING;
    }

    return AuditSeverity.INFO;
  }
}
