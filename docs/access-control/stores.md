# Store Adapters

The access control module uses a pluggable adapter pattern for persistence.

## Store Interface

```typescript
interface AccessStore {
  // Roles
  getRole(roleId: string): Promise<Role | null>;
  getRoleByName(name: string): Promise<Role | null>;
  getAllRoles(): Promise<Role[]>;
  createRole(role: RoleInput): Promise<Role>;
  updateRole(roleId: string, role: Partial<RoleInput>): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;

  // Permissions
  getPermission(permissionId: string): Promise<Permission | null>;
  getPermissionByKey(resource: string, action: string): Promise<Permission | null>;
  getAllPermissions(): Promise<Permission[]>;
  createPermission(permission: PermissionInput): Promise<Permission>;
  deletePermission(permissionId: string): Promise<void>;

  // User-Role assignments
  getUserRoles(userId: string): Promise<Role[]>;
  getRolePermissions(roleId: string): Promise<Permission[]>;
  assignRoleToUser(userId: string, roleId: string, assignedBy?: string): Promise<UserRole>;
  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
  getUserRoleIds(userId: string): Promise<string[]>;
}
```

## MemoryAccessStore

In-memory storage for development and testing.

```typescript
import { MemoryAccessStore } from "@/features/access-control";

const store = new MemoryAccessStore();
```

| Property | Value |
|----------|-------|
| Persistence | Ephemeral |
| Performance | Fastest |
| Use Case | Development, testing |

## DatabaseAccessStore

Production storage supporting PostgreSQL, MySQL, and MongoDB.

```typescript
import { DatabaseAccessStore } from "@/features/access-control";

// PostgreSQL
const store = new DatabaseAccessStore({
  databaseType: "postgresql",
  client: pgClient,
  tablePrefix: "ac",
});

// MySQL
const store = new DatabaseAccessStore({
  databaseType: "mysql",
  client: mysqlClient,
});

// MongoDB
const store = new DatabaseAccessStore({
  databaseType: "mongodb",
  client: mongoClient,
});
```

## Database Schema

**PostgreSQL/MySQL:**

```sql
CREATE TABLE ac_roles (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,
  isSystem BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ac_permissions (
  id VARCHAR(64) PRIMARY KEY,
  resource VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  description TEXT,
  UNIQUE(resource, action)
);

CREATE TABLE ac_user_roles (
  userId VARCHAR(64) NOT NULL,
  roleId VARCHAR(64) NOT NULL,
  assignedAt TIMESTAMP DEFAULT NOW(),
  assignedBy VARCHAR(64),
  PRIMARY KEY (userId, roleId)
);
```

## Custom Store

Implement the `AccessStore` interface for custom storage:

```typescript
class RedisAccessStore implements AccessStore {
  async getRole(roleId: string): Promise<Role | null> {
    // Implementation
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    // Implementation
  }

  // ... implement all other methods
}
```
