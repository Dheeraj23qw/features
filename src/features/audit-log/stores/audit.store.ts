import {
  AuditEvent,
  AuditFilter,
  PaginatedAuditEvents,
} from "../domain/models";

export interface AuditStore {
  save(event: AuditEvent): Promise<void>;
  find(filter: AuditFilter): Promise<PaginatedAuditEvents>;
  findById(eventId: string): Promise<AuditEvent | null>;
  findByActor(actorId: string, limit?: number): Promise<AuditEvent[]>;
  findByResource(
    resourceType: string,
    resourceId: string,
    limit?: number
  ): Promise<AuditEvent[]>;
  findByAction(action: string, limit?: number): Promise<AuditEvent[]>;
  getLatest(limit?: number): Promise<AuditEvent[]>;
  count(filter?: AuditFilter): Promise<number>;
}
