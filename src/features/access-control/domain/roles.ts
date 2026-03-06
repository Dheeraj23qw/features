import { Role, Permission } from "./models";
import { SYSTEM_ROLES } from "./permissions";

export const DEFAULT_ROLES: Role[] = [
  {
    id: "role-admin",
    name: "ADMIN",
    description: "Full system access",
    permissions: parsePermissions(SYSTEM_ROLES.ADMIN.permissions),
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "role-moderator",
    name: "MODERATOR",
    description: "Content moderation access",
    permissions: parsePermissions(SYSTEM_ROLES.MODERATOR.permissions),
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "role-user",
    name: "USER",
    description: "Standard user access",
    permissions: parsePermissions(SYSTEM_ROLES.USER.permissions),
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "role-guest",
    name: "GUEST",
    description: "Limited read-only access",
    permissions: parsePermissions(SYSTEM_ROLES.GUEST.permissions),
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function parsePermissions(permissionStrings: readonly string[]): Permission[] {
  return permissionStrings.map((p, index) => {
    const isWildcard = p.endsWith(":*");
    const [resource, action] = isWildcard ? [p.slice(0, -2), "*"] : p.split(":");
    return {
      id: `perm-${index}`,
      resource,
      action,
      description: `Permission for ${resource}:${action}`,
    };
  });
}
