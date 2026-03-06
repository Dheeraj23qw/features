import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class ValidationError extends BaseError {
  constructor(
    message: string = "Validation failed",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      metadata
    );
  }
}

export class BadRequestError extends BaseError {
  constructor(
    message: string = "Bad request",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      metadata
    );
  }
}
