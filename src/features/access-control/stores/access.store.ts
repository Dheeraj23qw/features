import { Role, Permission, UserRole, RoleInput, PermissionInput } from "../domain/models";

export interface AccessStore {
  getRole(roleId: string): Promise<Role | null>;
  getRoleByName(name: string): Promise<Role | null>;
  getAllRoles(): Promise<Role[]>;
  createRole(role: RoleInput): Promise<Role>;
  updateRole(roleId: string, role: Partial<RoleInput>): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;

  getPermission(permissionId: string): Promise<Permission | null>;
  getPermissionByKey(resource: string, action: string): Promise<Permission | null>;
  getAllPermissions(): Promise<Permission[]>;
  createPermission(permission: PermissionInput): Promise<Permission>;
  deletePermission(permissionId: string): Promise<void>;

  getUserRoles(userId: string): Promise<Role[]>;
  getRolePermissions(roleId: string): Promise<Permission[]>;
  assignRoleToUser(userId: string, roleId: string, assignedBy?: string): Promise<UserRole>;
  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
  getUserRoleIds(userId: string): Promise<string[]>;
}
