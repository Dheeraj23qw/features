export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string;
}

export interface RoleInput {
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface PermissionInput {
  resource: string;
  action: string;
  description?: string;
}

export interface ResourceContext {
  resourceType: string;
  resourceId?: string;
  resourceOwnerId?: string;
  [key: string]: unknown;
}

export interface AccessContext {
  userId: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  resource?: ResourceContext;
}

export type WildcardPermission = `${string}:*`;

export function parsePermission(permission: string): { resource: string; action: string; isWildcard: boolean } {
  const isWildcard = permission.endsWith(":*");
  if (isWildcard) {
    return {
      resource: permission.slice(0, -2),
      action: "*",
      isWildcard: true,
    };
  }
  const [resource, action] = permission.split(":");
  return { resource, action, isWildcard: false };
}

export function matchesPermission(required: string, granted: string): boolean {
  const requiredParsed = parsePermission(required);
  const grantedParsed = parsePermission(granted);

  if (grantedParsed.isWildcard) {
    return requiredParsed.resource === grantedParsed.resource;
  }

  return required === granted;
}

export function hasWildcardPermission(permissions: string[], resource: string): boolean {
  return permissions.some((p) => {
    const parsed = parsePermission(p);
    return parsed.isWildcard && parsed.resource === resource;
  });
}
