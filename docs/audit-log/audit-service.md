# Audit Service

The `AuditService` is the central orchestrator for all audit log operations.

## Initialization

```typescript
import { AuditService, MemoryAuditStore } from "@/features/audit-log";

const store = new MemoryAuditStore();

const auditService = new AuditService({
  store,
  enableHashChain: true,
  enableTamperDetection: true,
});

await auditService.initialize();
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `store` | `AuditStore` | required | Storage adapter |
| `enableHashChain` | `boolean` | `true` | Enable hash chain for tamper detection |
| `enableTamperDetection` | `boolean` | `true` | Verify event integrity |

## Core Methods

### log()

Create and save a new audit event.

```typescript
const event = await auditService.log({
  action: AuditAction.USER_UPDATED_PROFILE,
  actorId: user.id,
  actorType: ActorType.USER,
  resourceType: ResourceType.USER,
  resourceId: profile.id,
  metadata: { field: "email" },
  previousValue: { email: "old@example.com" },
  newValue: { email: "new@example.com" },
}, {
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  requestId: "req-123",
});
```

### query()

Query audit events with filters.

```typescript
const result = await auditService.query({
  actorId: userId,
  action: [AuditAction.USER_LOGIN, AuditAction.USER_LOGOUT],
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  limit: 20,
  offset: 0,
});

console.log(result.data);   // AuditEvent[]
console.log(result.total);  // Total matching events
console.log(result.limit);  // Requested limit
console.log(result.offset); // Requested offset
```

### findByActor()

Get all events for a specific actor.

```typescript
const events = await auditService.findByActor(userId, 50);
```

### findByResource()

Get all events for a specific resource.

```typescript
const events = await auditService.findByResource("USER", userId, 20);
```

### findByAction()

Get all events of a specific action type.

```typescript
const events = await auditService.findByAction(AuditAction.USER_LOGIN, 20);
```

### getLatest()

Get the most recent events.

```typescript
const events = await auditService.getLatest(10);
```

### verifyIntegrity()

Verify the hash chain has not been tampered with.

```typescript
const result = await auditService.verifyIntegrity();

if (!result.isValid) {
  console.error("Audit log tampering detected!");
  console.log(result.brokenChain); // Events with broken hash chain
}
```

## Severity Determination

The service automatically assigns severity based on action type:

| Severity | Actions |
|----------|---------|
| CRITICAL | USER_DELETED, USER_SUSPENDED, ROLE_ASSIGNED, PERMISSION_GRANTED, SYSTEM_CONFIG_CHANGED |
| WARNING | USER_LOGIN_FAILED, RATE_LIMIT_EXCEEDED, USER_PASSWORD_CHANGED |
| INFO | All other actions |

## Hash Chain

When enabled, each event contains a hash that includes the previous event's hash, creating a chain that detects tampering:

```
eventHash = SHA256(eventId|action|actorId|resourceType|resourceId|timestamp|previousEventHash)
```
