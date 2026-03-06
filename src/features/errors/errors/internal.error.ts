import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class InternalServerError extends BaseError {
  constructor(
    message: string = "Internal server error",
    metadata: Record<string, unknown> = {},
    isOperational: boolean = false
  ) {
    super(
      message,
      ERROR_CODES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      metadata,
      isOperational
    );
  }
}

export class DatabaseError extends BaseError {
  constructor(
    message: string = "Database error",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      metadata,
      false
    );
  }
}

export class ExternalServiceError extends BaseError {
  constructor(
    message: string = "External service error",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      metadata,
      false
    );
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(
    message: string = "Service unavailable",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      metadata
    );
  }
}
