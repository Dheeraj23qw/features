import { serializeError, ErrorResponse } from "../utils/error-serializer";
import { isOperationalError } from "../utils/error-serializer";
import { BaseError } from "../domain/base-error";

export interface ErrorHandlerOptions {
  includeStack?: boolean;
  includeMetadata?: boolean;
  logErrors?: boolean;
  onError?: (error: unknown) => void;
}

export interface ErrorHandlerContext {
  requestId?: string;
  path?: string;
  method?: string;
}

export function createErrorHandler(options: ErrorHandlerOptions = {}) {
  const { 
    includeStack = false, 
    includeMetadata = true,
    logErrors = true,
    onError 
  } = options;

  return function handleError(
    error: unknown,
    context?: ErrorHandlerContext
  ): ErrorResponse {
    if (logErrors) {
      console.error("[Error Handler]", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context,
        timestamp: new Date().toISOString(),
      });
    }

    if (onError) {
      try {
        onError(error);
      } catch {
        // Ignore errors in error handler
      }
    }

    const response = serializeError(error, {
      includeStack: process.env.NODE_ENV !== "production" || includeStack,
      includeMetadata,
      requestId: context?.requestId,
    });

    return response;
  };
}

export function getStatusCode(error: unknown): number {
  if (error instanceof BaseError) {
    return error.statusCode;
  }

  if (error instanceof Error) {
    if (error.name === "ValidationError") return 400;
    if (error.name === "UnauthorizedError") return 401;
    if (error.name === "ForbiddenError") return 403;
    if (error.name === "NotFoundError") return 404;
  }

  return 500;
}

export function toNextJsError(error: unknown): {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
} {
  const statusCode = getStatusCode(error);
  
  let message = "Internal Server Error";
  let details: Record<string, unknown> = {};

  if (error instanceof BaseError) {
    message = error.message;
    details = error.metadata;
  } else if (error instanceof Error) {
    message = process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred" 
      : error.message;
  }

  return { statusCode, message, details };
}
