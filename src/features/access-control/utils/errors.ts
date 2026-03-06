export class AuthorizationError extends Error {
  constructor(
    message: string,
    public code: string = "AUTHORIZATION_DENIED",
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class RoleNotFoundError extends Error {
  constructor(roleId: string) {
    super(`Role "${roleId}" not found`);
    this.name = "RoleNotFoundError";
  }
}

export class RoleAlreadyExistsError extends Error {
  constructor(roleName: string) {
    super(`Role "${roleName}" already exists`);
    this.name = "RoleAlreadyExistsError";
  }
}

export class CannotModifySystemRoleError extends Error {
  constructor() {
    super("Cannot modify system role");
    this.name = "CannotModifySystemRoleError";
  }
}

export class PermissionDeniedError extends Error {
  constructor(
    message: string = "You do not have permission to perform this action",
    public requiredPermission?: string
  ) {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

export class InvalidPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPermissionError";
  }
}
