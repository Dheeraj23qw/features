# Domain Models

## User
The core identity record for a user in the system.

```typescript
interface User {
  id: string;
  email: string;
  username?: string;
  role: UserRole;            // ADMIN | MODERATOR | USER
  status: UserStatus;        // ACTIVE | INACTIVE | SUSPENDED | DELETED
  createdAt: Date;
  updatedAt: Date;
}
```

## UserProfile
Extended profile data stored separately from the core User record.

```typescript
interface UserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
}
```

## UserPreferences
Per-user application settings stored independently.

```typescript
interface UserPreferences {
  userId: string;
  theme?: "light" | "dark" | "system";
  language?: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  dashboardLayout?: "grid" | "list";
}
```

## RBAC Permissions

| Role | Permissions |
|------|------------|
| `ADMIN` | `user:read`, `user:create`, `user:update`, `user:delete`, `user:manage_roles`, `user:view_all` |
| `MODERATOR` | `user:read`, `user:update`, `user:view_all` |
| `USER` | `user:read`, `user:update_own` |

```typescript
import { hasUserPermission, UserRole } from "@/features/user";

if (!hasUserPermission(UserRole.ADMIN, "user:delete")) { /* deny */ }
```
