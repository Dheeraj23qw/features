export const ACCESS_CONTROL_CONFIG = {
  DEFAULT_PERMISSION_CACHE_TTL: 300000,
  MAX_ROLE_NAME_LENGTH: 64,
  MAX_DESCRIPTION_LENGTH: 255,
} as const;

export const PERMISSION_REGEX = /^[A-Z][A-Z0-9_]*:[A-Z][A-Z0-9_*]*$/;

export function isValidPermissionFormat(permission: string): boolean {
  return PERMISSION_REGEX.test(permission);
}

export function isWildcardPermission(permission: string): boolean {
  return permission.endsWith(":*");
}

export function getPermissionParts(permission: string): { resource: string; action: string } | null {
  const match = permission.match(/^([^:]+):(.+)$/);
  if (!match) return null;
  return { resource: match[1], action: match[2] };
}
