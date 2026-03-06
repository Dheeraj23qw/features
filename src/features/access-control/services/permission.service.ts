import { Permission, PermissionInput } from "../domain/models";
import { AccessStore } from "../stores/access.store";

export class PermissionService {
  private store: AccessStore;

  constructor(store: AccessStore) {
    this.store = store;
  }

  async getPermission(permissionId: string): Promise<Permission | null> {
    return this.store.getPermission(permissionId);
  }

  async getPermissionByKey(resource: string, action: string): Promise<Permission | null> {
    return this.store.getPermissionByKey(resource, action);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.store.getAllPermissions();
  }

  async createPermission(input: PermissionInput): Promise<Permission> {
    const existing = await this.store.getPermissionByKey(input.resource, input.action);
    if (existing) {
      return existing;
    }
    return this.store.createPermission(input);
  }

  async deletePermission(permissionId: string): Promise<void> {
    return this.store.deletePermission(permissionId);
  }

  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    const all = await this.store.getAllPermissions();
    return all.filter((p) => p.resource === resource);
  }

  async getPermissionsByResources(resources: string[]): Promise<Permission[]> {
    const all = await this.store.getAllPermissions();
    return all.filter((p) => resources.includes(p.resource));
  }
}
