# Domain Models

## Permission

Represents an action that can be performed on a resource.

```typescript
interface Permission {
  id: string;
  resource: string;    // e.g., "USER", "POST"
  action: string;      // e.g., "READ", "UPDATE"
  description?: string;
}
```

## Role

Represents a collection of permissions.

```typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## UserRole

Links a user to a role.

```typescript
interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string;
}
```

## AccessContext

Context for access decisions.

```typescript
interface AccessContext {
  userId: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  resource?: ResourceContext;
}
```

## Permission Format

Permissions follow the pattern `RESOURCE:ACTION`:

| Permission | Resource | Action |
|------------|----------|--------|
| `USER:READ` | USER | READ |
| `USER:UPDATE` | USER | UPDATE |
| `ORDER:CREATE` | ORDER | CREATE |
| `POST:*` | POST | all actions |

## Wildcard Permissions

Wildcard permissions use `*` to grant all actions on a resource:

- `USER:*` - All user operations
- `ADMIN:*` - All admin operations
- `*:*` - Super admin (all permissions)

## System Roles

The module includes built-in system roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| ADMIN | Full system access | All permissions |
| MODERATOR | Content moderation | User read, Post all |
| USER | Standard user | Own user data, session management |
| GUEST | Limited access | Read-only |
