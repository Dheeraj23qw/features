# Context Capture

Utilities for automatically capturing request context for audit events.

## extractContextFromRequest()

Extract audit context from HTTP request headers.

```typescript
import { extractContextFromRequest, getClientIp, getUserAgent } from "@/features/audit-log";

// Extract from Next.js request
const context = extractContextFromRequest({
  "x-forwarded-for": "192.168.1.1, 10.0.0.1",
  "user-agent": "Mozilla/5.0...",
  "x-request-id": "req-abc123",
});

// Result:
// {
//   ipAddress: "192.168.1.1",
//   userAgent: "Mozilla/5.0...",
//   requestId: "req-abc123"
// }
```

## Individual Utilities

### getClientIp()

Extract client IP from request headers, handling proxies.

```typescript
const ip = getClientIp({
  "x-forwarded-for": "192.168.1.1, 10.0.0.1",
  "x-real-ip": "192.168.1.1",
});
// Returns: "192.168.1.1"
```

### getUserAgent()

Extract user agent string from request headers.

```typescript
const ua = getUserAgent({
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
});
```

### getRequestId()

Extract or generate request ID from headers.

```typescript
const requestId = getRequestId({
  "x-correlation-id": "corr-123",
});
// Returns: "corr-123"
```

## Context Manager

`AuditContextManager` provides a singleton for storing context across a request lifecycle.

```typescript
import { AuditContextManager } from "@/features/audit-log";

const manager = AuditContextManager.getInstance();

// Set context from request headers
manager.setFromRequest(request.headers);

// Mark as authenticated user
manager.setAuthenticatedUser(userId, sessionId);

// Get context for logging
const context = manager.getContext();

// Clear after request
manager.clearContext();
```

## Usage with Middleware

```typescript
import { createAuditMiddleware } from "@/features/audit-log/middlewares/audit.middleware";

const auditMiddleware = createAuditMiddleware({
  auditService,
  getUserId: (req) => req.headers["x-user-id"] as string,
});
```
