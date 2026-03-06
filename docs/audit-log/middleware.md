# HTTP Middleware

The audit middleware automatically tracks HTTP requests and logs audit events.

## createAuditMiddleware()

Create a middleware wrapper for Next.js route handlers.

```typescript
import { createAuditMiddleware, auditService, AuditAction } from "@/features/audit-log";

const auditMiddleware = createAuditMiddleware({
  auditService,
  getUserId: (req) => req.headers["x-user-id"] as string,
  excludePaths: ["/health", "/ping"],
  includePaths: ["/api/"],
});
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `auditService` | `AuditService` | Required audit service instance |
| `getUserId` | `function` | Extract user ID from request |
| `getUserType` | `function` | Extract actor type from request |
| `getResourceFromPath` | `function` | Extract resource type/ID from URL path |
| `excludePaths` | `string[]` | Paths to exclude from auditing |
| `includePaths` | `string[]` | Paths to include (if empty, all paths) |
| `sensitiveFields` | `string[]` | Fields to redact from metadata |

## Basic Usage

```typescript
// Wrap a route handler
const handler = auditMiddleware(AuditAction.API_REQUEST, async (req) => {
  // Your route logic
  return Response.json({ success: true });
});

// Or wrap individual operations
export async function POST(req: Request) {
  const auditedHandler = auditMiddleware(AuditAction.USER_CREATED, async (req) => {
    // Create user logic
    return Response.json({ user });
  });
  
  return auditedHandler(req);
}
```

## Resource Extraction

Automatically extract resource type and ID from URL paths:

```typescript
const auditMiddleware = createAuditMiddleware({
  auditService,
  getResourceFromPath: (path) => {
    const match = path.match(/\/api\/users\/([^/]+)/);
    if (match) {
      return { type: "USER", id: match[1] };
    }
    return null;
  },
});
```

## Decorator Usage

Use the `@auditEndpoint` decorator to automatically audit endpoint methods:

```typescript
import { auditEndpoint, AuditAction } from "@/features/audit-log";

class UserController {
  @auditEndpoint({ action: AuditAction.USER_CREATED })
  async createUser(req: Request) {
    // Implementation
  }
}
```

## withAuditLogging()

Programmatic logging for specific operations:

```typescript
import { withAuditLogging, auditService } from "@/features/audit-log";

const logAudit = withAuditLogging(auditService, {
  getUserId: (req) => req.headers["x-user-id"] as string,
  sensitiveFields: ["password", "token"],
});

// In your route handler
await logAudit(request, AuditAction.USER_UPDATED, {
  resourceType: "USER",
  resourceId: userId,
  metadata: { changes: ["email", "name"] },
});
```

## Request Interface

The middleware works with any request object that has a `headers` property:

```typescript
interface RequestLike {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
  nextUrl?: {
    pathname: string;
  };
}
```
