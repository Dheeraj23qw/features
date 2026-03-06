import { randomUUID } from "crypto";
import {
  Role,
  Permission,
  UserRole,
  RoleInput,
  PermissionInput,
} from "../domain/models";
import { AccessStore } from "./access.store";

export type DatabaseClient = {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>;
  collection(name: string): DatabaseCollection;
};

export interface DatabaseCollection {
  find(query: Record<string, unknown>): DatabaseQuery;
  insertOne(doc: Record<string, unknown>): Promise<{ insertedId: string }>;
  updateOne(query: Record<string, unknown>, update: Record<string, unknown>): Promise<{ modifiedCount: number }>;
  deleteOne(query: Record<string, unknown>): Promise<{ deletedCount: number }>;
  deleteMany(query: Record<string, unknown>): Promise<{ deletedCount: number }>;
}

export interface DatabaseQuery {
  limit(n: number): DatabaseQuery;
  skip(n: number): DatabaseQuery;
  sort(field: string, direction: 1 | -1): DatabaseQuery;
  toArray(): Promise<unknown[]>;
  count(): Promise<number>;
}

export type DatabaseType = "postgresql" | "mysql" | "mongodb";

export interface DatabaseAccessStoreOptions {
  client: DatabaseClient;
  tablePrefix?: string;
  databaseType: DatabaseType;
}

export class DatabaseAccessStore implements AccessStore {
  private client: DatabaseClient;
  private tablePrefix: string;
  private databaseType: DatabaseType;

  constructor(options: DatabaseAccessStoreOptions) {
    this.client = options.client;
    this.tablePrefix = options.tablePrefix || "ac";
    this.databaseType = options.databaseType;
  }

  get rolesTable(): string {
    return `${this.tablePrefix}_roles`;
  }

  get permissionsTable(): string {
    return `${this.tablePrefix}_permissions`;
  }

  get userRolesTable(): string {
    return `${this.tablePrefix}_user_roles`;
  }

  async ensureTables(): Promise<void> {
    if (this.databaseType === "mongodb") return;
    
    const createRolesTable = this.databaseType === "postgresql"
      ? `CREATE TABLE IF NOT EXISTS ${this.rolesTable} (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(64) UNIQUE NOT NULL,
          description TEXT,
          permissions JSONB,
          "isSystem" BOOLEAN DEFAULT FALSE,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        );`
      : `CREATE TABLE IF NOT EXISTS ${this.rolesTable} (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(64) UNIQUE NOT NULL,
          description TEXT,
          permissions JSON,
          isSystem BOOLEAN DEFAULT FALSE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

    const createPermissionsTable = this.databaseType === "postgresql"
      ? `CREATE TABLE IF NOT EXISTS ${this.permissionsTable} (
          id VARCHAR(64) PRIMARY KEY,
          resource VARCHAR(64) NOT NULL,
          action VARCHAR(64) NOT NULL,
          description TEXT,
          UNIQUE(resource, action)
        );`
      : `CREATE TABLE IF NOT EXISTS ${this.permissionsTable} (
          id VARCHAR(64) PRIMARY KEY,
          resource VARCHAR(64) NOT NULL,
          action VARCHAR(64) NOT NULL,
          description TEXT,
          UNIQUE(resource, action)
        );`;

    const createUserRolesTable = this.databaseType === "postgresql"
      ? `CREATE TABLE IF NOT EXISTS ${this.userRolesTable} (
          "userId" VARCHAR(64) NOT NULL,
          "roleId" VARCHAR(64) NOT NULL,
          "assignedAt" TIMESTAMP DEFAULT NOW(),
          "assignedBy" VARCHAR(64),
          PRIMARY KEY ("userId", "roleId")
        );`
      : `CREATE TABLE IF NOT EXISTS ${this.userRolesTable} (
          userId VARCHAR(64) NOT NULL,
          roleId VARCHAR(64) NOT NULL,
          assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          assignedBy VARCHAR(64),
          PRIMARY KEY (userId, roleId)
        );`;

    await this.client.query(createRolesTable);
    await this.client.query(createPermissionsTable);
    await this.client.query(createUserRolesTable);
  }

  async getRole(roleId: string): Promise<Role | null> {
    if (this.databaseType === "mongodb") {
      const results = await this.client
        .collection(this.rolesTable)
        .find({ id: roleId })
        .limit(1)
        .toArray();
      return results.length > 0 ? this.deserializeRole(results[0]) : null;
    }

    const result = await this.client.query(
      `SELECT * FROM ${this.rolesTable} WHERE id = $1`,
      [roleId]
    );
    return result.rows.length > 0 ? this.deserializeRole(result.rows[0]) : null;
  }

  async getRoleByName(name: string): Promise<Role | null> {
    if (this.databaseType === "mongodb") {
      const results = await this.client
        .collection(this.rolesTable)
        .find({ name })
        .limit(1)
        .toArray();
      return results.length > 0 ? this.deserializeRole(results[0]) : null;
    }

    const result = await this.client.query(
      `SELECT * FROM ${this.rolesTable} WHERE name = $1`,
      [name]
    );
    return result.rows.length > 0 ? this.deserializeRole(result.rows[0]) : null;
  }

  async getAllRoles(): Promise<Role[]> {
    if (this.databaseType === "mongodb") {
      const results = await this.client.collection(this.rolesTable).find({}).toArray();
      return results.map(this.deserializeRole);
    }

    const result = await this.client.query(`SELECT * FROM ${this.rolesTable}`);
    return result.rows.map(this.deserializeRole);
  }

  async createRole(input: RoleInput): Promise<Role> {
    const role: Role = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      permissions: input.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.rolesTable).insertOne(this.serializeRole(role));
    } else {
      const columns = ["id", "name", "description", "permissions", "createdAt", "updatedAt"];
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      await this.client.query(
        `INSERT INTO ${this.rolesTable} (${columns.join(", ")}) VALUES (${placeholders})`,
        [role.id, role.name, role.description, JSON.stringify(role.permissions), role.createdAt, role.updatedAt]
      );
    }

    return role;
  }

  async updateRole(roleId: string, input: Partial<RoleInput>): Promise<Role> {
    const existing = await this.getRole(roleId);
    if (!existing) {
      throw new Error(`Role ${roleId} not found`);
    }

    const updated: Role = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.rolesTable).updateOne(
        { id: roleId },
        { $set: this.serializeRole(updated) }
      );
    } else {
      const setClauses: string[] = [];
      const params: unknown[] = [];
      
      if (input.name !== undefined) {
        params.push(input.name);
        setClauses.push(`name = $${params.length}`);
      }
      if (input.description !== undefined) {
        params.push(input.description);
        setClauses.push(`description = $${params.length}`);
      }
      if (input.permissions !== undefined) {
        params.push(JSON.stringify(input.permissions));
        setClauses.push(`permissions = $${params.length}`);
      }
      
      params.push(new Date());
      setClauses.push(`"updatedAt" = $${params.length}`);
      params.push(roleId);

      await this.client.query(
        `UPDATE ${this.rolesTable} SET ${setClauses.join(", ")} WHERE id = $${params.length}`,
        params
      );
    }

    return updated;
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = await this.getRole(roleId);
    if (role?.isSystem) {
      throw new Error("Cannot delete system role");
    }

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.rolesTable).deleteOne({ id: roleId });
      await this.client.collection(this.userRolesTable).deleteMany({ roleId });
    } else {
      await this.client.query(`DELETE FROM ${this.rolesTable} WHERE id = $1`, [roleId]);
      await this.client.query(`DELETE FROM ${this.userRolesTable} WHERE "roleId" = $1`, [roleId]);
    }
  }

  async getPermission(permissionId: string): Promise<Permission | null> {
    if (this.databaseType === "mongodb") {
      const results = await this.client
        .collection(this.permissionsTable)
        .find({ id: permissionId })
        .limit(1)
        .toArray();
      return results.length > 0 ? this.deserializePermission(results[0]) : null;
    }

    const result = await this.client.query(
      `SELECT * FROM ${this.permissionsTable} WHERE id = $1`,
      [permissionId]
    );
    return result.rows.length > 0 ? this.deserializePermission(result.rows[0]) : null;
  }

  async getPermissionByKey(resource: string, action: string): Promise<Permission | null> {
    if (this.databaseType === "mongodb") {
      const results = await this.client
        .collection(this.permissionsTable)
        .find({ resource, action })
        .limit(1)
        .toArray();
      return results.length > 0 ? this.deserializePermission(results[0]) : null;
    }

    const result = await this.client.query(
      `SELECT * FROM ${this.permissionsTable} WHERE resource = $1 AND action = $2`,
      [resource, action]
    );
    return result.rows.length > 0 ? this.deserializePermission(result.rows[0]) : null;
  }

  async getAllPermissions(): Promise<Permission[]> {
    if (this.databaseType === "mongodb") {
      const results = await this.client.collection(this.permissionsTable).find({}).toArray();
      return results.map(this.deserializePermission);
    }

    const result = await this.client.query(`SELECT * FROM ${this.permissionsTable}`);
    return result.rows.map(this.deserializePermission);
  }

  async createPermission(input: PermissionInput): Promise<Permission> {
    const existing = await this.getPermissionByKey(input.resource, input.action);
    if (existing) return existing;

    const permission: Permission = {
      id: randomUUID(),
      resource: input.resource,
      action: input.action,
      description: input.description,
    };

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.permissionsTable).insertOne(permission as unknown as Record<string, unknown>);
    } else {
      await this.client.query(
        `INSERT INTO ${this.permissionsTable} (id, resource, action, description) VALUES ($1, $2, $3, $4)`,
        [permission.id, permission.resource, permission.action, permission.description]
      );
    }

    return permission;
  }

  async deletePermission(permissionId: string): Promise<void> {
    if (this.databaseType === "mongodb") {
      await this.client.collection(this.permissionsTable).deleteOne({ id: permissionId });
    } else {
      await this.client.query(`DELETE FROM ${this.permissionsTable} WHERE id = $1`, [permissionId]);
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    if (this.databaseType === "mongodb") {
      const userRoles = await this.client
        .collection(this.userRolesTable)
        .find({ userId })
        .toArray();
      const roleIds = userRoles.map((ur: unknown) => (ur as Record<string, unknown>).roleId as string);
      
      if (roleIds.length === 0) return [];
      
      const results = await this.client
        .collection(this.rolesTable)
        .find({ id: { $in: roleIds } })
        .toArray();
      return results.map(this.deserializeRole);
    }

    const result = await this.client.query(
      `SELECT r.* FROM ${this.rolesTable} r
       INNER JOIN ${this.userRolesTable} ur ON r.id = ur."roleId"
       WHERE ur."userId" = $1`,
      [userId]
    );
    return result.rows.map(this.deserializeRole);
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.getRole(roleId);
    return role?.permissions || [];
  }

  async assignRoleToUser(userId: string, roleId: string, assignedBy?: string): Promise<UserRole> {
    const userRole: UserRole = {
      userId,
      roleId,
      assignedAt: new Date(),
      assignedBy,
    };

    if (this.databaseType === "mongodb") {
      await this.client.collection(this.userRolesTable).insertOne(userRole as unknown as Record<string, unknown>);
    } else {
      await this.client.query(
        `INSERT INTO ${this.userRolesTable} ("userId", "roleId", "assignedAt", "assignedBy") VALUES ($1, $2, $3, $4)`,
        [userId, roleId, userRole.assignedAt, assignedBy]
      );
    }

    return userRole;
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    if (this.databaseType === "mongodb") {
      await this.client.collection(this.userRolesTable).deleteOne({ userId, roleId });
    } else {
      await this.client.query(
        `DELETE FROM ${this.userRolesTable} WHERE "userId" = $1 AND "roleId" = $2`,
        [userId, roleId]
      );
    }
  }

  async getUserRoleIds(userId: string): Promise<string[]> {
    if (this.databaseType === "mongodb") {
      const userRoles = await this.client
        .collection(this.userRolesTable)
        .find({ userId })
        .toArray();
      return userRoles.map((ur: unknown) => (ur as Record<string, unknown>).roleId as string);
    }

    const result = await this.client.query(
      `SELECT "roleId" FROM ${this.userRolesTable} WHERE "userId" = $1`,
      [userId]
    );
    return result.rows.map((row) => (row as Record<string, unknown>).roleId as string);
  }

  private serializeRole(role: Role): Record<string, unknown> {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  private deserializeRole(row: unknown): Role {
    const data = row as Record<string, unknown>;
    return {
      id: data.id as string,
      name: data.name as string,
      description: data.description as string | undefined,
      permissions: (data.permissions as Permission[]) || [],
      isSystem: data.isSystem as boolean | undefined,
      createdAt: new Date(data.createdAt as string),
      updatedAt: new Date(data.updatedAt as string),
    };
  }

  private deserializePermission(row: unknown): Permission {
    const data = row as Record<string, unknown>;
    return {
      id: data.id as string,
      resource: data.resource as string,
      action: data.action as string,
      description: data.description as string | undefined,
    };
  }
}
