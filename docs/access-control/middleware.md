# Middleware

The module provides middleware for protecting Next.js routes.

## createAuthorizeMiddleware

Create a middleware that protects routes based on permissions.

```typescript
import { createAuthorizeMiddleware, accessControl } from "@/features/access-control";

const authorize = createAuthorizeMiddleware(accessControl);
```

## Basic Usage

```typescript
const handler = authorize(
  { resource: "USER", action: "UPDATE" },
  async (request) => {
    // Route logic - only runs if authorized
    return Response.json({ success: true });
  }
);
```

## Middleware Options

| Option | Type | Description |
|--------|------|-------------|
| `resource` | string | Resource to protect |
| `action` | string | Action required |
| `resourceIdParam` | string | URL param containing resource ID |
| `ownerField` | string | Body field containing owner ID |

## Complete Example

```typescript
import { createAuthorizeMiddleware, accessControl } from "@/features/access-control";

const authorize = createAuthorizeMiddleware(accessControl);

// Protect user update endpoint
export async function PUT(req: Request) {
  const request = {
    userId: req.headers.get("x-user-id"),
    headers: req.headers,
    params: { id: "123" },
    body: await req.json(),
  };

  const handler = authorize(
    { resource: "USER", action: "UPDATE" },
    async (req) => {
      // Update user logic
      return Response.json({ success: true });
    }
  );

  return handler(request);
}
```

## Route Protection Helper

```typescript
import { requirePermission, requireRole } from "@/features/access-control/api/middleware";

// Require specific permission
const withPermission = requirePermission(accessControl, "USER:DELETE");

// Require specific role
const withAdminRole = requireRole(accessControl, "ADMIN");

// Usage
async function deleteUser(userId: string) {
  await withAdminRole(userId, async () => {
    // Delete user logic
  });
}
```

## Error Handling

The middleware throws `AuthorizationError` on access denial:

```typescript
import { AuthorizationError } from "@/features/access-control";

try {
  await handler(request);
} catch (error) {
  if (error instanceof AuthorizationError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  throw error;
}
```

## Response Codes

| Code | Message |
|------|---------|
| 401 | Authentication required |
| 403 | Forbidden - insufficient permissions |
