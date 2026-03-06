import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class ConflictError extends BaseError {
  constructor(
    message: string = "Resource conflict",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.RESOURCE_CONFLICT,
      HTTP_STATUS.CONFLICT,
      metadata
    );
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor(
    message: string = "User already exists",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.USER_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT,
      metadata
    );
  }
}

export class DuplicateEntryError extends BaseError {
  constructor(
    message: string = "Duplicate entry",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.DUPLICATE_ENTRY,
      HTTP_STATUS.CONFLICT,
      metadata
    );
  }
}
