export enum Role {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    USER = "USER",
}

export enum Permission {
    READ_USERS = "READ_USERS",
    CREATE_USERS = "CREATE_USERS",
    DELETE_USERS = "DELETE_USERS",
    MANAGE_ROLES = "MANAGE_ROLES",
    MANAGE_PAYMENTS = "MANAGE_PAYMENTS",
    READ_CONTENT = "READ_CONTENT",
    MANAGE_CONTENT = "MANAGE_CONTENT",
}

export const RolePermissions: Record<Role, Permission[]> = {
    [Role.ADMIN]: [
        Permission.READ_USERS,
        Permission.CREATE_USERS,
        Permission.DELETE_USERS,
        Permission.MANAGE_ROLES,
        Permission.MANAGE_PAYMENTS,
        Permission.READ_CONTENT,
        Permission.MANAGE_CONTENT,
    ],
    [Role.MODERATOR]: [
        Permission.READ_USERS,
        Permission.READ_CONTENT,
        Permission.MANAGE_CONTENT,
    ],
    [Role.USER]: [
        Permission.READ_CONTENT,
    ],
};

export const getUserPermissions = (roles: string[]): Permission[] => {
    const permSet = new Set<Permission>();
    for (const role of roles) {
        const perms = RolePermissions[role as Role] || [];
        perms.forEach(p => permSet.add(p));
    }
    return Array.from(permSet);
};

export const hasPermission = (roles: string[], permission: Permission): boolean => {
    return getUserPermissions(roles).includes(permission);
};
