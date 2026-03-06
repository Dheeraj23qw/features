import { randomUUID } from "crypto";
import {
  Role,
  Permission,
  AccessContext,
  matchesPermission,
  hasWildcardPermission,
} from "../domain/models";
import { AccessStore } from "../stores/access.store";

export interface AccessControlOptions {
  store: AccessStore;
}

export class AccessControlService {
  private store: AccessStore;
  private permissionCache: Map<string, string[]> = new Map();

  constructor(options: AccessControlOptions) {
    this.store = options.store;
  }

  async hasPermission(userId: string, requiredPermission: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return this.checkPermission(requiredPermission, userPermissions);
  }

  async can(
    userId: string,
    action: string,
    resource: string,
    context?: { resourceOwnerId?: string }
  ): Promise<boolean> {
    const requiredPermission = `${resource}:${action}`;
    const hasAccess = await this.hasPermission(userId, requiredPermission);

    if (!hasAccess) return false;

    if (context?.resourceOwnerId) {
      const policyResult = await this.evaluatePolicies(userId, action, resource, context);
      return policyResult;
    }

    return true;
  }

  private async checkPermission(required: string, granted: string[]): Promise<boolean> {
    for (const permission of granted) {
      if (matchesPermission(required, permission)) {
        return true;
      }
    }
    return false;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const cached = this.permissionCache.get(userId);
    if (cached) return cached;

    const roles = await this.store.getUserRoles(userId);
    const permissions = new Set<string>();

    for (const role of roles) {
      for (const perm of role.permissions) {
        permissions.add(`${perm.resource}:${perm.action}`);
      }
    }

    const permissionList = Array.from(permissions);
    this.permissionCache.set(userId, permissionList);
    return permissionList;
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    return this.store.getUserRoles(userId);
  }

  async assignRole(userId: string, roleId: string, assignedBy?: string): Promise<void> {
    await this.store.assignRoleToUser(userId, roleId, assignedBy);
    this.invalidateCache(userId);
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.store.removeRoleFromUser(userId, roleId);
    this.invalidateCache(userId);
  }

  async createRole(name: string, description?: string, permissions?: Permission[]): Promise<Role> {
    return this.store.createRole({ name, description, permissions });
  }

  async updateRole(roleId: string, data: { name?: string; description?: string; permissions?: Permission[] }): Promise<Role> {
    const updated = await this.store.updateRole(roleId, data);
    this.invalidateAllCache();
    return updated;
  }

  async deleteRole(roleId: string): Promise<void> {
    await this.store.deleteRole(roleId);
    this.invalidateAllCache();
  }

  async getRole(roleId: string): Promise<Role | null> {
    return this.store.getRole(roleId);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.store.getAllRoles();
  }

  async createPermission(resource: string, action: string, description?: string): Promise<Permission> {
    return this.store.createPermission({ resource, action, description });
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.store.getAllPermissions();
  }

  async evaluatePolicies(
    userId: string,
    action: string,
    resource: string,
    context: { resourceOwnerId?: string }
  ): Promise<boolean> {
    return true;
  }

  invalidateCache(userId: string): void {
    this.permissionCache.delete(userId);
  }

  invalidateAllCache(): void {
    this.permissionCache.clear();
  }
}
