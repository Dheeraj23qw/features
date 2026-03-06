# Overview

The Enterprise Error Handling Module (`src/features/errors`) provides a standardized error handling system for the application. It includes typed errors, HTTP error mapping, structured error responses, and global error handling.

## Key Features

- **Typed Errors**: All errors extend a common BaseError class
- **HTTP Mapping**: Each error type maps to appropriate HTTP status codes
- **Structured Responses**: Consistent JSON error responses
- **Error Codes**: Centralized error codes for all error types
- **Stack Trace Control**: Stack traces hidden in production
- **Error Handler**: Global error handler for Express/Next.js

## Table of Contents

1. [Architecture](./architecture.md)
2. [Error Types](./error-types.md)
3. [Error Codes](./error-codes.md)
4. [Error Handler](./error-handler.md)
5. [Usage](./usage.md)
