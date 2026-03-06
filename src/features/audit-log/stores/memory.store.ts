import {
  AuditEvent,
  AuditFilter,
  PaginatedAuditEvents,
  ActorType,
} from "../domain/models";
import { AuditStore } from "./audit.store";

export class MemoryAuditStore implements AuditStore {
  private events: Map<string, AuditEvent> = new Map();
  private eventOrder: string[] = [];

  async save(event: AuditEvent): Promise<void> {
    this.events.set(event.eventId, event);
    this.eventOrder.push(event.eventId);

    if (this.eventOrder.length > 100000) {
      const toRemove = this.eventOrder.splice(0, 50000);
      for (const id of toRemove) {
        this.events.delete(id);
      }
    }
  }

  async find(filter: AuditFilter): Promise<PaginatedAuditEvents> {
    let results = Array.from(this.events.values());

    if (filter.actorId) {
      results = results.filter((e) => e.actorId === filter.actorId);
    }

    if (filter.actorType) {
      results = results.filter((e) => e.actorType === filter.actorType);
    }

    if (filter.action) {
      const actions = Array.isArray(filter.action)
        ? filter.action
        : [filter.action];
      results = results.filter((e) => actions.includes(e.action));
    }

    if (filter.resourceType) {
      results = results.filter((e) => e.resourceType === filter.resourceType);
    }

    if (filter.resourceId) {
      results = results.filter((e) => e.resourceId === filter.resourceId);
    }

    if (filter.startDate) {
      results = results.filter(
        (e) => new Date(e.timestamp) >= filter.startDate!
      );
    }

    if (filter.endDate) {
      results = results.filter(
        (e) => new Date(e.timestamp) <= filter.endDate!
      );
    }

    if (filter.severity) {
      results = results.filter((e) => e.severity === filter.severity);
    }

    results.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = results.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 20;

    return {
      data: results.slice(offset, offset + limit),
      total,
      limit,
      offset,
    };
  }

  async findById(eventId: string): Promise<AuditEvent | null> {
    return this.events.get(eventId) || null;
  }

  async findByActor(actorId: string, limit = 20): Promise<AuditEvent[]> {
    const results = Array.from(this.events.values())
      .filter((e) => e.actorId === actorId)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    return results.slice(0, limit);
  }

  async findByResource(
    resourceType: string,
    resourceId: string,
    limit = 20
  ): Promise<AuditEvent[]> {
    const results = Array.from(this.events.values())
      .filter(
        (e) => e.resourceType === resourceType && e.resourceId === resourceId
      )
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    return results.slice(0, limit);
  }

  async findByAction(action: string, limit = 20): Promise<AuditEvent[]> {
    const results = Array.from(this.events.values())
      .filter((e) => e.action === action)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    return results.slice(0, limit);
  }

  async getLatest(limit = 20): Promise<AuditEvent[]> {
    const results = Array.from(this.events.values())
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    return results.slice(0, limit);
  }

  async count(filter?: AuditFilter): Promise<number> {
    if (!filter) {
      return this.events.size;
    }
    const result = await this.find({ ...filter, limit: 0, offset: 0 });
    return result.total;
  }

  clear(): void {
    this.events.clear();
    this.eventOrder = [];
  }
}
