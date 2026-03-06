import { UserRole } from "./enums";

/**
 * Maps user roles to the permissions they hold in the user management context.
 * Mirrors the RBAC map in the auth feature — kept separate to avoid circular imports.
 */
export const UserRolePermissions: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: [
        "user:read",
        "user:create",
        "user:update",
        "user:delete",
        "user:manage_roles",
        "user:view_all",
    ],
    [UserRole.MODERATOR]: [
        "user:read",
        "user:update",
        "user:view_all",
    ],
    [UserRole.USER]: [
        "user:read",
        "user:update_own",
    ],
};

export const hasUserPermission = (role: UserRole, permission: string): boolean => {
    return (UserRolePermissions[role] ?? []).includes(permission);
};
