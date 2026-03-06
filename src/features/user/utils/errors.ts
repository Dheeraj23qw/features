export class UserError extends Error {
    constructor(message: string, public readonly code: string, public readonly statusCode: number = 400) {
        super(message);
        this.name = "UserError";
    }
}

export class UserNotFoundError extends UserError {
    constructor(id?: string) {
        super(id ? `User not found: ${id}` : "User not found.", "USER_NOT_FOUND", 404);
    }
}

export class UserAlreadyExistsError extends UserError {
    constructor(field = "email") {
        super(`A user with this ${field} already exists.`, "USER_ALREADY_EXISTS", 409);
    }
}

export class UserSuspendedError extends UserError {
    constructor() {
        super("This account has been suspended.", "USER_SUSPENDED", 403);
    }
}

export class UserDeletedError extends UserError {
    constructor() {
        super("This account has been deleted.", "USER_DELETED", 410);
    }
}

export class InvalidStatusTransitionError extends UserError {
    constructor(from: string, to: string) {
        super(`Cannot transition user status from '${from}' to '${to}'.`, "INVALID_STATUS_TRANSITION", 422);
    }
}

export class UserValidationError extends UserError {
    constructor(message: string) {
        super(message, "USER_VALIDATION_ERROR", 422);
    }
}
