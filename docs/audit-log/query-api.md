# Query API

The audit log module provides flexible querying capabilities for building admin dashboards and analytics.

## Basic Queries

### Query by Actor

```typescript
const events = await auditService.findByActor(userId, 20);
```

### Query by Resource

```typescript
const events = await auditService.findByResource("USER", targetUserId, 50);
```

### Query by Action

```typescript
const events = await auditService.findByAction(AuditAction.USER_LOGIN, 100);
```

### Get Latest Events

```typescript
const events = await auditService.getLatest(10);
```

## Advanced Filtering

### Complex Filter

```typescript
const result = await auditService.query({
  actorId: userId,
  actorType: ActorType.USER,
  action: [AuditAction.USER_LOGIN, AuditAction.USER_LOGOUT, AuditAction.USER_UPDATED],
  resourceType: "USER",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  severity: AuditSeverity.INFO,
  limit: 50,
  offset: 0,
});
```

### Paginated Results

```typescript
// First page
const page1 = await auditService.query({
  limit: 20,
  offset: 0,
});

// Second page
const page2 = await auditService.query({
  limit: 20,
  offset: 20,
});
```

## Use Cases

### User Activity Timeline

```typescript
async function getUserActivityTimeline(userId: string, days = 30) {
  return auditService.query({
    actorId: userId,
    startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    limit: 100,
  });
}
```

### Security Event Monitoring

```typescript
async function getSecurityEvents(startDate: Date, endDate: Date) {
  return auditService.query({
    action: [
      AuditAction.USER_LOGIN_FAILED,
      AuditAction.SUSPICIOUS_ACTIVITY,
      AuditAction.RATE_LIMIT_EXCEEDED,
      AuditAction.INVALID_TOKEN,
    ],
    startDate,
    endDate,
    severity: [AuditSeverity.WARNING, AuditSeverity.ERROR, AuditSeverity.CRITICAL],
    limit: 100,
  });
}
```

### Resource Change History

```typescript
async function getResourceHistory(resourceType: string, resourceId: string) {
  return auditService.findByResource(resourceType, resourceId, 50);
}
```

### Admin Action Audit

```typescript
async function getAdminActions(startDate: Date) {
  return auditService.query({
    action: [
      AuditAction.ROLE_ASSIGNED,
      AuditAction.ROLE_REMOVED,
      AuditAction.PERMISSION_GRANTED,
      AuditAction.PERMISSION_REVOKED,
      AuditAction.SYSTEM_CONFIG_CHANGED,
    ],
    startDate,
    limit: 200,
  });
}
```

### Failed Login Attempts

```typescript
async function getFailedLogins(userId: string) {
  return auditService.findByAction(AuditAction.USER_LOGIN_FAILED, 10);
}
```

## Response Format

```typescript
interface PaginatedAuditEvents {
  data: AuditEvent[];   // Array of audit events
  total: number;        // Total matching events
  limit: number;         // Requested limit
  offset: number;        // Requested offset
}
```

## Event Emitter Queries

Listen for events in real-time:

```typescript
import { auditEvents } from "@/features/audit-log";

auditEvents.onLogged(({ event }) => {
  console.log("Audit event logged:", event.eventId);
  
  // Send to external system
  sendToAnalytics(event);
});

auditEvents.onFailed(({ error, attemptedEvent }) => {
  console.error("Audit logging failed:", error);
});
```
