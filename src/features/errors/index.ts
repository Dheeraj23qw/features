export type { ErrorMetadata } from "./domain/base-error";
export { BaseError } from "./domain/base-error";

export { ERROR_CODES, HTTP_STATUS } from "./domain/error-codes";
export type { ErrorCode } from "./domain/error-codes";

export { ValidationError, BadRequestError } from "./errors/validation.error";
export {
  AuthenticationError,
  InvalidCredentialsError,
  TokenExpiredError,
  TokenInvalidError,
  AccountLockedError,
  MFARequiredError,
  MFAInvalidError,
} from "./errors/authentication.error";

export {
  AuthorizationError,
  PermissionDeniedError,
  InsufficientPermissionsError,
} from "./errors/authorization.error";

export { NotFoundError, UserNotFoundError } from "./errors/not-found.error";

export {
  ConflictError,
  UserAlreadyExistsError,
  DuplicateEntryError,
} from "./errors/conflict.error";

export {
  InternalServerError,
  DatabaseError,
  ExternalServiceError,
  ServiceUnavailableError,
} from "./errors/internal.error";

export {
  serializeError,
  isOperationalError,
} from "./utils/error-serializer";
export type { ErrorResponse, SerializationOptions } from "./utils/error-serializer";

export {
  createErrorHandler,
  getStatusCode,
  toNextJsError,
} from "./api/error-handler";
export type { ErrorHandlerOptions, ErrorHandlerContext } from "./api/error-handler";
