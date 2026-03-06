# Security

The audit log module implements several security features to ensure log integrity and compliance.

## Append-Only Design

Audit logs are designed to be append-only. Once an event is saved, it cannot be modified or deleted through the API:

```typescript
// The store interface only provides save, not update or delete
interface AuditStore {
  save(event: AuditEvent): Promise<void>;
  // No update() or delete() methods
}
```

## Tamper Detection

The hash chain mechanism detects any tampering with historical events:

### How It Works

1. Each event includes a SHA-256 hash
2. The hash includes the previous event's hash
3. Any modification breaks the chain

```typescript
const auditService = new AuditService({
  store: databaseStore,
  enableHashChain: true,
  enableTamperDetection: true,
});

await auditService.initialize();

// Verify integrity periodically
const result = await auditService.verifyIntegrity();

if (!result.isValid) {
  // Alert security team
  console.error("Tampering detected!", result.brokenChain);
}
```

### Hash Computation

```typescript
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

const eventHash = createHash("sha256").update(data).digest("hex");
```

## Sensitive Data Handling

The module provides utilities to redact sensitive fields:

```typescript
import { sanitizeObject, isSensitiveField } from "@/features/audit-log";

// Check if a field is sensitive
isSensitiveField("password");        // true
isSensitiveField("apiKey");          // true
isSensitiveField("userName");        // false

// Sanitize an object
const sanitized = sanitizeObject({
  username: "john",
  password: "secret123",  // Will be redacted
  email: "john@example.com",
});

// Result: { username: "john", password: "[REDACTED]", email: "john@example.com" }
```

### Default Sensitive Fields

- `password`
- `passwordHash`
- `secret`
- `token`
- `accessToken`
- `refreshToken`
- `apiKey`
- `privateKey`
- `ssn`
- `creditCard`

## Access Control

Implement access control at the application level:

```typescript
// Only allow admins to query audit logs
async function queryAuditLogs(userId: string, filter: AuditFilter) {
  const user = await getUser(userId);
  
  if (user.role !== "ADMIN") {
    throw new PermissionDeniedError("Only admins can query audit logs");
  }
  
  return auditService.query(filter);
}
```

## Compliance

The module supports compliance requirements:

| Requirement | Implementation |
|-------------|----------------|
| Immutable logs | Append-only with hash chain |
| Tamper detection | SHA-256 hash verification |
| Data retention | Implement in store layer |
| Access logging | Full event tracking |
| PII protection | Sanitization utilities |
