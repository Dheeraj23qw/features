# Access Control Service

The `AccessControlService` is the central orchestrator for all access control operations.

## Initialization

```typescript
import { AccessControlService, MemoryAccessStore } from "@/features/access-control";

const store = new MemoryAccessStore();

const accessControl = new AccessControlService({
  store,
});
```

## Core Methods

### hasPermission()

Check if user has a specific permission.

```typescript
const allowed = await accessControl.hasPermission(userId, "USER:READ");
```

### can()

Check if user can perform an action on a resource.

```typescript
const allowed = await accessControl.can(
  userId,
  "UPDATE",    // action
  "USER",      // resource
  { resourceOwnerId: "target-user-id" } // optional context
);
```

### getUserPermissions()

Get all permissions for a user.

```typescript
const permissions = await accessControl.getUserPermissions(userId);
// Returns: ["USER:READ", "USER:UPDATE", "POST:CREATE"]
```

### getUserRoles()

Get all roles assigned to a user.

```typescript
const roles = await accessControl.getUserRoles(userId);
```

### assignRole()

Assign a role to a user.

```typescript
await accessControl.assignRole(userId, "role-admin", "admin-user-id");
```

### removeRole()

Remove a role from a user.

```typescript
await accessControl.removeRole(userId, "role-moderator");
```

### createRole()

Create a new role.

```typescript
const role = await accessControl.createRole(
  "CONTENT_MANAGER",
  "Can manage content",
  [{ resource: "POST", action: "*", id: "1" }]
);
```

### updateRole()

Update an existing role.

```typescript
const updated = await accessControl.updateRole(roleId, {
  name: "NEW_NAME",
  permissions: [...],
});
```

### deleteRole()

Delete a role (system roles cannot be deleted).

```typescript
await accessControl.deleteRole(roleId);
```

## Caching

The service caches user permissions for performance:

```typescript
accessControl.invalidateCache(userId);     // Invalidate single user
accessControl.invalidateAllCache();       // Invalidate all caches
```
