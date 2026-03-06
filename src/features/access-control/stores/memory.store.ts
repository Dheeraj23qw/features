import { randomUUID } from "crypto";
import {
  Role,
  Permission,
  UserRole,
  RoleInput,
  PermissionInput,
} from "../domain/models";
import { DEFAULT_ROLES } from "../domain/roles";
import { AccessStore } from "./access.store";

export class MemoryAccessStore implements AccessStore {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userRoles: Map<string, Set<string>> = new Map();
  private rolePermissions: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    for (const role of DEFAULT_ROLES) {
      this.roles.set(role.id, role);
      const permIds = new Set(role.permissions.map((p) => p.id));
      this.rolePermissions.set(role.id, permIds);

      for (const perm of role.permissions) {
        if (!this.permissions.has(perm.id)) {
          this.permissions.set(perm.id, perm);
        }
      }
    }
  }

  async getRole(roleId: string): Promise<Role | null> {
    return this.roles.get(roleId) || null;
  }

  async getRoleByName(name: string): Promise<Role | null> {
    for (const role of this.roles.values()) {
      if (role.name === name) return role;
    }
    return null;
  }

  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
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
    this.roles.set(role.id, role);

    if (input.permissions) {
      const permIds = new Set(input.permissions.map((p) => p.id));
      this.rolePermissions.set(role.id, permIds);
    }

    return role;
  }

  async updateRole(roleId: string, input: Partial<RoleInput>): Promise<Role> {
    const existing = this.roles.get(roleId);
    if (!existing) {
      throw new Error(`Role ${roleId} not found`);
    }

    const updated: Role = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };
    this.roles.set(roleId, updated);

    if (input.permissions) {
      const permIds = new Set(input.permissions.map((p) => p.id));
      this.rolePermissions.set(roleId, permIds);
    }

    return updated;
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = this.roles.get(roleId);
    if (role?.isSystem) {
      throw new Error("Cannot delete system role");
    }
    this.roles.delete(roleId);
    this.rolePermissions.delete(roleId);

    for (const userId of this.userRoles.keys()) {
      const roles = this.userRoles.get(userId);
      if (roles?.has(roleId)) {
        roles.delete(roleId);
      }
    }
  }

  async getPermission(permissionId: string): Promise<Permission | null> {
    return this.permissions.get(permissionId) || null;
  }

  async getPermissionByKey(resource: string, action: string): Promise<Permission | null> {
    for (const perm of this.permissions.values()) {
      if (perm.resource === resource && perm.action === action) {
        return perm;
      }
    }
    return null;
  }

  async getAllPermissions(): Promise<Permission[]> {
    return Array.from(this.permissions.values());
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
    this.permissions.set(permission.id, permission);
    return permission;
  }

  async deletePermission(permissionId: string): Promise<void> {
    this.permissions.delete(permissionId);

    for (const rolePerms of this.rolePermissions.values()) {
      rolePerms.delete(permissionId);
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const roleIds = this.userRoles.get(userId);
    if (!roleIds) return [];

    const roles: Role[] = [];
    for (const roleId of roleIds) {
      const role = this.roles.get(roleId);
      if (role) {
        const permissions = await this.getRolePermissions(roleId);
        roles.push({ ...role, permissions });
      }
    }
    return roles;
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const permIds = this.rolePermissions.get(roleId);
    if (!permIds) return [];

    const permissions: Permission[] = [];
    for (const permId of permIds) {
      const perm = this.permissions.get(permId);
      if (perm) permissions.push(perm);
    }
    return permissions;
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
    assignedBy?: string
  ): Promise<UserRole> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId)!.add(roleId);

    return {
      userId,
      roleId,
      assignedAt: new Date(),
      assignedBy,
    };
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const roles = this.userRoles.get(userId);
    if (roles) {
      roles.delete(roleId);
    }
  }

  async getUserRoleIds(userId: string): Promise<string[]> {
    const roleIds = this.userRoles.get(userId);
    return roleIds ? Array.from(roleIds) : [];
  }
}
