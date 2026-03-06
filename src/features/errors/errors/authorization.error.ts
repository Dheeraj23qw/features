import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class AuthorizationError extends BaseError {
  constructor(
    message: string = "Access denied",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.FORBIDDEN,
      HTTP_STATUS.FORBIDDEN,
      metadata
    );
  }
}

export class PermissionDeniedError extends BaseError {
  constructor(
    message: string = "Permission denied",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.PERMISSION_DENIED,
      HTTP_STATUS.FORBIDDEN,
      metadata
    );
  }
}

export class InsufficientPermissionsError extends BaseError {
  constructor(
    message: string = "Insufficient permissions",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS,
      HTTP_STATUS.FORBIDDEN,
      metadata
    );
  }
}
