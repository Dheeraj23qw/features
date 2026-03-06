import { BaseError } from "../domain/base-error";
import { ERROR_CODES, HTTP_STATUS } from "../domain/error-codes";

export class AuthenticationError extends BaseError {
  constructor(
    message: string = "Authentication required",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor(
    message: string = "Invalid credentials",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class TokenExpiredError extends BaseError {
  constructor(
    message: string = "Token has expired",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.TOKEN_EXPIRED,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class TokenInvalidError extends BaseError {
  constructor(
    message: string = "Invalid token",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.TOKEN_INVALID,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class AccountLockedError extends BaseError {
  constructor(
    message: string = "Account is locked",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.ACCOUNT_LOCKED,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class MFARequiredError extends BaseError {
  constructor(
    message: string = "MFA verification required",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.MFA_REQUIRED,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}

export class MFAInvalidError extends BaseError {
  constructor(
    message: string = "Invalid MFA code",
    metadata: Record<string, unknown> = {}
  ) {
    super(
      message,
      ERROR_CODES.MFA_INVALID,
      HTTP_STATUS.UNAUTHORIZED,
      metadata
    );
  }
}
