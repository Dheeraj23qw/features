# Security

The access control module implements several security features.

## Privilege Escalation Prevention

### Role Assignment Validation

Only authorized users can assign roles:

```typescript
await accessControl.assignRole(userId, roleId, assignedBy);
```

The `assignedBy` parameter tracks who assigned the role for audit purposes.

### System Role Protection

System roles cannot be modified or deleted:

```typescript
await accessControl.deleteRole("role-admin");
// Throws: Cannot delete system role
```

## Permission Validation

### Format Validation

Permissions must follow the `RESOURCE:ACTION` format:

```typescript
import { isValidPermissionFormat } from "@/features/access-control";

isValidPermissionFormat("USER:READ");     // true
isValidPermissionFormat("invalid");       // false
isValidPermissionFormat("*:*");            // true (wildcard)
```

### Wildcard Safety

Wildcard permissions are evaluated carefully:

```typescript
// USER:* matches USER:READ, USER:UPDATE, etc.
hasWildcardPermission(["USER:*"], "USER:READ");  // true
hasWildcardPermission(["USER:*"], "POST:DELETE"); // false
```

## Missing Role Handling

The system safely handles users with no roles:

```typescript
const hasAccess = await accessControl.can(userId, "READ", "USER");
// Returns false for users without roles
```

## Error Messages

Generic error messages prevent information leakage:

```typescript
// Bad - reveals if user exists
"User not found"

// Good - generic message
"Access denied"
```

## Best Practices

1. **Least Privilege**: Grant minimum required permissions
2. **Role Auditing**: Monitor role assignments
3. **Regular Review**: Periodically review user permissions
4. **System Roles**: Never modify system roles
5. **Logging**: Log all authorization decisions
