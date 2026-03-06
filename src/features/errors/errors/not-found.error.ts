import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class NotFoundError extends BaseError {
  constructor(
    message: string = "Resource not found",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
      metadata
    );
  }
}

export class UserNotFoundError extends BaseError {
  constructor(
    message: string = "User not found",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
      metadata
    );
  }
}
