# Domain Models & RBAC

## Core Models

### User
```typescript
interface User {
  id: string;
  email: string;
  passwordHash?: string;       // Absent for OAuth-only users
  roles: string[];             // ["USER"] | ["ADMIN"] | ["MODERATOR"] …
  status: UserStatus;          // ACTIVE | PENDING_VERIFICATION | SUSPENDED
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  mfaMethod?: MFAMethod;       // TOTP | EMAIL_CODE
  mfaSecret?: string;         // Encrypted TOTP seed
  oauthProviders: string[];    // ["GOOGLE", "GITHUB"]
  createdAt: Date;
  updatedAt: Date;
}
```

### Session
```typescript
interface Session {
  id: string;
  userId: string;
  refreshToken: string;       // Hashed token stored here
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
}
```

## RBAC — Roles & Permissions

All roles and their resolved permissions are defined statically in `domain/permissions.ts`.

| Role | Permissions |
|------|-------------|
| `ADMIN` | `READ_USERS`, `CREATE_USERS`, `DELETE_USERS`, `MANAGE_ROLES`, `MANAGE_PAYMENTS`, `READ_CONTENT`, `MANAGE_CONTENT` |
| `MODERATOR` | `READ_USERS`, `READ_CONTENT`, `MANAGE_CONTENT` |
| `USER` | `READ_CONTENT` |

### Checking permissions at runtime

```typescript
import { hasPermission, getUserPermissions, Permission } from "@/features/auth";

// In a route handler:
const payload = requireAuth(req);
if (!hasPermission(payload.roles, Permission.DELETE_USERS)) {
  throw new PermissionDeniedError();
}

// Or use the shortcut:
requirePermission(payload, Permission.MANAGE_PAYMENTS);
```
