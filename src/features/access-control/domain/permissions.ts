export const DEFAULT_PERMISSIONS = {
  USER: {
    READ: "USER:READ",
    CREATE: "USER:CREATE",
    UPDATE: "USER:UPDATE",
    DELETE: "USER:DELETE",
    READ_ALL: "USER:READ_ALL",
    UPDATE_ALL: "USER:UPDATE_ALL",
    MANAGE_ROLES: "USER:MANAGE_ROLES",
  },
  ROLE: {
    READ: "ROLE:READ",
    CREATE: "ROLE:CREATE",
    UPDATE: "ROLE:UPDATE",
    DELETE: "ROLE:DELETE",
  },
  PERMISSION: {
    READ: "PERMISSION:READ",
  },
  SESSION: {
    READ: "SESSION:READ",
    REVOKE: "SESSION:REVOKE",
    REVOKE_ALL: "SESSION:REVOKE_ALL",
  },
  FILE: {
    READ: "FILE:READ",
    CREATE: "FILE:CREATE",
    UPDATE: "FILE:UPDATE",
    DELETE: "FILE:DELETE",
  },
  AUDIT: {
    READ: "AUDIT:READ",
  },
  CONFIG: {
    READ: "CONFIG:READ",
    UPDATE: "CONFIG:UPDATE",
  },
} as const;

export const ADMIN_PERMISSIONS = [
  "*:*",
  "USER:*",
  "ROLE:*",
  "PERMISSION:*",
  "SESSION:*",
  "FILE:*",
  "AUDIT:*",
  "CONFIG:*",
];

export const SYSTEM_ROLES = {
  ADMIN: {
    name: "ADMIN",
    description: "Full system access",
    permissions: ADMIN_PERMISSIONS,
  },
  MODERATOR: {
    name: "MODERATOR",
    description: "Content moderation access",
    permissions: [
      "USER:READ",
      "USER:READ_ALL",
      "USER:UPDATE",
      "POST:*",
      "COMMENT:*",
    ],
  },
  USER: {
    name: "USER",
    description: "Standard user access",
    permissions: [
      "USER:READ",
      "USER:UPDATE",
      "SESSION:READ",
      "SESSION:REVOKE",
    ],
  },
  GUEST: {
    name: "GUEST",
    description: "Limited read-only access",
    permissions: [
      "USER:READ",
    ],
  },
} as const;

export type SystemRoleName = keyof typeof SYSTEM_ROLES;
