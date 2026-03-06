# Store Adapters

The audit log module uses a pluggable adapter pattern for persistence, allowing easy swapping between different storage backends.

## Store Interface

```typescript
interface AuditStore {
  save(event: AuditEvent): Promise<void>;
  find(filter: AuditFilter): Promise<PaginatedAuditEvents>;
  findById(eventId: string): Promise<AuditEvent | null>;
  findByActor(actorId: string, limit?: number): Promise<AuditEvent[]>;
  findByResource(resourceType: string, resourceId: string, limit?: number): Promise<AuditEvent[]>;
  findByAction(action: string, limit?: number): Promise<AuditEvent[]>;
  getLatest(limit?: number): Promise<AuditEvent[]>;
  count(filter?: AuditFilter): Promise<number>;
}
```

## MemoryAuditStore

In-memory storage for development and testing.

```typescript
import { MemoryAuditStore } from "@/features/audit-log";

const store = new MemoryAuditStore();
```

| Property | Value |
|----------|-------|
| Persistence | Ephemeral (lost on restart) |
| Performance | Fastest option |
| Use Case | Development, testing |

### Features

- Automatic cleanup when storing >100,000 events
- Thread-safe operations
- No external dependencies

## DatabaseAuditStore

Production-ready storage supporting PostgreSQL, MySQL, and MongoDB.

```typescript
import { DatabaseAuditStore } from "@/features/audit-log";

// PostgreSQL
const postgresStore = new DatabaseAuditStore({
  databaseType: "postgresql",
  client: pgClient,
  tableName: "audit_logs",
});

// MySQL
const mysqlStore = new DatabaseAuditStore({
  databaseType: "mysql",
  client: mysqlClient,
  tableName: "audit_logs",
});

// MongoDB
const mongoStore = new DatabaseAuditStore({
  databaseType: "mongodb",
  client: mongoClient,
  tableName: "audit_logs",
});
```

### Database Schema

**PostgreSQL:**
```sql
CREATE TABLE audit_logs (
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
```

### Client Interface

```typescript
type DatabaseClient = {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>;
  collection(name: string): DatabaseCollection;
};
```

## Custom Store

Implement the `AuditStore` interface for custom storage solutions:

```typescript
import { AuditStore, AuditEvent, AuditFilter, PaginatedAuditEvents } from "@/features/audit-log";

class RedisAuditStore implements AuditStore {
  async save(event: AuditEvent): Promise<void> {
    await this.redis.lpush("audit:events", JSON.stringify(event));
  }

  async find(filter: AuditFilter): Promise<PaginatedAuditEvents> {
    // Implementation
  }

  // ... implement other methods
}
```
