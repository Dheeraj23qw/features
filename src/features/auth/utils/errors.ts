export class AuthError extends Error {
    constructor(message: string, public readonly code: string, public readonly statusCode: number = 401) {
        super(message);
        this.name = "AuthError";
    }
}

export class InvalidCredentialsError extends AuthError {
    constructor() {
        super("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }
}

export class AccountLockedError extends AuthError {
    constructor(minutes: number) {
        super(`Account is locked. Try again in ${minutes} minutes.`, "ACCOUNT_LOCKED", 429);
    }
}

export class TokenExpiredError extends AuthError {
    constructor() {
        super("Token has expired.", "TOKEN_EXPIRED", 401);
    }
}

export class TokenInvalidError extends AuthError {
    constructor() {
        super("Token is invalid.", "TOKEN_INVALID", 401);
    }
}

export class EmailNotVerifiedError extends AuthError {
    constructor() {
        super("Email address has not been verified.", "EMAIL_NOT_VERIFIED", 403);
    }
}

export class MFARequiredError extends AuthError {
    constructor() {
        super("Multi-factor authentication is required.", "MFA_REQUIRED", 403);
    }
}

export class PermissionDeniedError extends AuthError {
    constructor() {
        super("You do not have permission to perform this action.", "PERMISSION_DENIED", 403);
    }
}

export class UserNotFoundError extends AuthError {
    constructor() {
        super("User not found.", "USER_NOT_FOUND", 404);
    }
}

export class UserAlreadyExistsError extends AuthError {
    constructor() {
        super("A user with this email already exists.", "USER_ALREADY_EXISTS", 409);
    }
}
