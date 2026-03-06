import {
  AuditEvent,
  AuditFilter,
  PaginatedAuditEvents,
  ActorType,
  AuditSeverity,
} from "../domain/models";
import { AuditStore } from "./audit.store";

export type DatabaseClient = {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>;
  collection(name: string): DatabaseCollection;
};

export interface DatabaseCollection {
  find(query: Record<string, unknown>): DatabaseQuery;
  insertOne(doc: Record<string, unknown>): Promise<{ insertedId: string }>;
  updateOne(
    query: Record<string, unknown>,
    update: Record<string, unknown>
  ): Promise<{ modifiedCount: number }>;
  deleteOne(query: Record<string, unknown>): Promise<{ deletedCount: number }>;
}

export interface DatabaseQuery {
  limit(n: number): DatabaseQuery;
  skip(n: number): DatabaseQuery;
  sort(field: string, direction: 1 | -1): DatabaseQuery;
  toArray(): Promise<unknown[]>;
  count(): Promise<number>;
}

export type DatabaseType = "postgresql" | "mysql" | "mongodb";

export interface DatabaseAuditStoreOptions {
  client: DatabaseClient;
  tableName?: string;
  databaseType: DatabaseType;
}

export class DatabaseAuditStore implements AuditStore {
  private client: DatabaseClient;
  private tableName: string;
  private databaseType: DatabaseType;

  constructor(options: DatabaseAuditStoreOptions) {
    this.client = options.client;
    this.tableName = options.tableName || "audit_logs";
    this.databaseType = options.databaseType;
  }

  async ensureTable(): Promise<void> {
    switch (this.databaseType) {
      case "postgresql":
      case "mysql":
        await this.client.query(this.getSQLCreateTable());
        break;
      case "mongodb":
        break;
    }
  }

  private getSQLCreateTable(): string {
    if (this.databaseType === "postgresql") {
      return `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          "eventId" VARCHAR(64) PRIMARY KEY,
          "action" VARCHAR(64) NOT NULL,
          "actorId" VARCHAR(64) NOT NULL,
          "actorType" VARCHAR(32) NOT NULL,
          "resourceType" VARCHAR(64),
          "resourceId" VARCHAR(64),
          "timestamp" TIMESTAMP NOT NULL,
          "metadata" JSONB,
          "context" JSONB,
          "severity" VARCHAR(16),
          "description" TEXT,
          "previousValue" JSONB,
          "newValue" JSONB,
          "eventHash" VARCHAR(128),
          "previousEventHash" VARCHAR(128),
          INDEX idx_actor_id ("actorId"),
          INDEX idx_resource ("resourceType", "resourceId"),
          INDEX idx_action ("action"),
          INDEX idx_timestamp ("timestamp")
        );
      `;
    }

    return `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        eventId VARCHAR(64) PRIMARY KEY,
        action VARCHAR(64) NOT NULL,
        actorId VARCHAR(64) NOT NULL,
        actorType VARCHAR(32) NOT NULL,
        resourceType VARCHAR(64),
        resourceId VARCHAR(64),
        timestamp DATETIME NOT NULL,
        metadata JSON,
        context JSON,
        severity VARCHAR(16),
        description TEXT,
        previousValue JSON,
        newValue JSON,
        eventHash VARCHAR(128),
        previousEventHash VARCHAR(128),
        INDEX idx_actor_id (actorId),
        INDEX idx_resource (resourceType, resourceId),
        INDEX idx_action (action),
        INDEX idx_timestamp (timestamp)
      );
    `;
  }

  async save(event: AuditEvent): Promise<void> {
    const data = this.serializeEvent(event);

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.tableName).insertOne(data);
    } else {
      const columns = Object.keys(data).join(", ");
      const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ");
      const values = Object.values(data);
      await this.client.query(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );
    }
  }

  async find(filter: AuditFilter): Promise<PaginatedAuditEvents> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter.actorId) {
      params.push(filter.actorId);
      conditions.push(`actorId = $${params.length}`);
    }

    if (filter.actorType) {
      params.push(filter.actorType);
      conditions.push(`actorType = $${params.length}`);
    }

    if (filter.action) {
      if (Array.isArray(filter.action)) {
        const placeholders = filter.action.map((_, i) => `$${params.length + i + 1}`).join(", ");
        conditions.push(`action IN (${placeholders})`);
        params.push(...filter.action);
      } else {
        params.push(filter.action);
        conditions.push(`action = $${params.length}`);
      }
    }

    if (filter.resourceType) {
      params.push(filter.resourceType);
      conditions.push(`resourceType = $${params.length}`);
    }

    if (filter.resourceId) {
      params.push(filter.resourceId);
      conditions.push(`resourceId = $${params.length}`);
    }

    if (filter.startDate) {
      params.push(filter.startDate);
      conditions.push(`timestamp >= $${params.length}`);
    }

    if (filter.endDate) {
      params.push(filter.endDate);
      conditions.push(`timestamp <= $${params.length}`);
    }

    if (filter.severity) {
      params.push(filter.severity);
      conditions.push(`severity = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filter.limit || 20;
    const offset = filter.offset || 0;

    const countResult = await this.client.query(
      `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`,
      params
    );
    const total = Number((countResult.rows[0] as { total?: number })?.total || 0);

    const orderColumn = this.databaseType === "mysql" ? "timestamp" : `"timestamp"`;
    const dataResult = await this.client.query(
      `SELECT * FROM ${this.tableName} ${whereClause} ORDER BY ${orderColumn} DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return {
      data: (dataResult.rows as unknown[]).map(this.deserializeEvent),
      total,
      limit,
      offset,
    };
  }

  async findById(eventId: string): Promise<AuditEvent | null> {
    if (this.databaseType === "mongodb") {
      const results = await this.client
        .collection(this.tableName)
        .find({ eventId })
        .limit(1)
        .toArray();
      return results.length > 0 ? this.deserializeEvent(results[0]) : null;
    }

    const result = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE eventId = $1`,
      [eventId]
    );
    return result.rows.length > 0
      ? this.deserializeEvent(result.rows[0])
      : null;
  }

  async findByActor(actorId: string, limit = 20): Promise<AuditEvent[]> {
    const filter: AuditFilter = { actorId, limit };
    const result = await this.find(filter);
    return result.data;
  }

  async findByResource(
    resourceType: string,
    resourceId: string,
    limit = 20
  ): Promise<AuditEvent[]> {
    const filter: AuditFilter = { resourceType, resourceId, limit };
    const result = await this.find(filter);
    return result.data;
  }

  async findByAction(action: string, limit = 20): Promise<AuditEvent[]> {
    const filter: AuditFilter = { action, limit };
    const result = await this.find(filter);
    return result.data;
  }

  async getLatest(limit = 20): Promise<AuditEvent[]> {
    const result = await this.find({ limit });
    return result.data;
  }

  async count(filter?: AuditFilter): Promise<number> {
    if (!filter) {
      const result = await this.client.query(
        `SELECT COUNT(*) as total FROM ${this.tableName}`
      );
      return Number((result.rows[0] as { total?: number })?.total || 0);
    }
    const result = await this.find({ ...filter, limit: 0, offset: 0 });
    return result.total;
  }

  private serializeEvent(event: AuditEvent): Record<string, unknown> {
    return {
      eventId: event.eventId,
      action: event.action,
      actorId: event.actorId,
      actorType: event.actorType,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      timestamp: new Date(event.timestamp).toISOString(),
      metadata: JSON.stringify(event.metadata || {}),
      context: JSON.stringify(event.context || {}),
      severity: event.severity,
      description: event.description,
      previousValue: JSON.stringify(event.previousValue || {}),
      newValue: JSON.stringify(event.newValue || {}),
      eventHash: event.eventHash,
      previousEventHash: event.previousEventHash,
    };
  }

  private deserializeEvent(row: unknown): AuditEvent {
    const data = row as Record<string, unknown>;
    return {
      eventId: data.eventId as string,
      action: data.action as string,
      actorId: data.actorId as string,
      actorType: data.actorType as ActorType,
      resourceType: data.resourceType as string | undefined,
      resourceId: data.resourceId as string | undefined,
      timestamp: new Date(data.timestamp as string),
      metadata: data.metadata
        ? JSON.parse(data.metadata as string)
        : undefined,
      context: data.context ? JSON.parse(data.context as string) : undefined,
      severity: data.severity as AuditSeverity | undefined,
      description: data.description as string | undefined,
      previousValue: data.previousValue
        ? JSON.parse(data.previousValue as string)
        : undefined,
      newValue: data.newValue
        ? JSON.parse(data.newValue as string)
        : undefined,
      eventHash: data.eventHash as string | undefined,
      previousEventHash: data.previousEventHash as string | undefined,
    };
  }
}
