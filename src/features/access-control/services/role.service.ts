import { Role, Permission, RoleInput } from "../domain/models";
import { AccessStore } from "../stores/access.store";

export class RoleService {
  private store: AccessStore;

  constructor(store: AccessStore) {
    this.store = store;
  }

  async getRole(roleId: string): Promise<Role | null> {
    return this.store.getRole(roleId);
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return this.store.getRoleByName(name);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.store.getAllRoles();
  }

  async createRole(input: RoleInput): Promise<Role> {
    const existing = await this.store.getRoleByName(input.name);
    if (existing) {
      throw new Error(`Role with name "${input.name}" already exists`);
    }
    return this.store.createRole(input);
  }

  async updateRole(roleId: string, input: Partial<RoleInput>): Promise<Role> {
    const existing = await this.store.getRole(roleId);
    if (!existing) {
      throw new Error(`Role ${roleId} not found`);
    }
    if (existing.isSystem) {
      throw new Error("Cannot modify system role");
    }
    return this.store.updateRole(roleId, input);
  }

  async deleteRole(roleId: string): Promise<void> {
    const existing = await this.store.getRole(roleId);
    if (!existing) {
      throw new Error(`Role ${roleId} not found`);
    }
    if (existing.isSystem) {
      throw new Error("Cannot delete system role");
    }
    return this.store.deleteRole(roleId);
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    return this.store.getRolePermissions(roleId);
  }

  async addPermissionToRole(roleId: string, permission: Permission): Promise<Role> {
    const role = await this.store.getRole(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }

    const existingPermissions = [...role.permissions];
    const permKey = `${permission.resource}:${permission.action}`;
    
    const hasPermission = existingPermissions.some(
      (p) => `${p.resource}:${p.action}` === permKey
    );

    if (!hasPermission) {
      existingPermissions.push(permission);
      return this.store.updateRole(roleId, { permissions: existingPermissions });
    }

    return role;
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.store.getRole(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }

    const existingPermissions = role.permissions.filter((p) => p.id !== permissionId);
    return this.store.updateRole(roleId, { permissions: existingPermissions });
  }
}
