import { BaseError } from "../domain/base-error";

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    status: number;
    timestamp: string;
    requestId?: string;
    details?: Record<string, unknown>;
  };
}

export interface SerializationOptions {
  includeStack?: boolean;
  includeMetadata?: boolean;
  requestId?: string;
}

export function serializeError(
  error: unknown,
  options: SerializationOptions = {}
): ErrorResponse {
  const { includeStack = false, includeMetadata = true, requestId } = options;

  if (error instanceof BaseError) {
    const response: ErrorResponse = {
      error: {
        code: error.code,
        message: error.message,
        status: error.statusCode,
        timestamp: error.timestamp.toISOString(),
        requestId,
      },
    };

    if (includeMetadata && Object.keys(error.metadata).length > 0) {
      response.error.details = error.metadata;
    }

    if (includeStack && error.stack) {
      response.error.details = {
        ...response.error.details,
        stack: error.stack,
      };
    }

    return response;
  }

  if (error instanceof Error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === "production" 
          ? "An unexpected error occurred" 
          : error.message,
        status: 500,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }

  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      status: 500,
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
}

export function isOperationalError(error: unknown): boolean {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}
