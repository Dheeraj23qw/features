# Architecture

The error handling module follows a hierarchical error class structure with centralized error codes.

## Error Hierarchy

```
Error
  └── BaseError (abstract)
        ├── ValidationError (400)
        ├── AuthenticationError (401)
        │     ├── InvalidCredentialsError
        │     ├── TokenExpiredError
        │     ├── TokenInvalidError
        │     └── MFARequiredError
        ├── AuthorizationError (403)
        │     ├── PermissionDeniedError
        │     └── InsufficientPermissionsError
        ├── NotFoundError (404)
        ├── ConflictError (409)
        │     ├── UserAlreadyExistsError
        │     └── DuplicateEntryError
        └── InternalServerError (500)
              ├── DatabaseError
              ├── ExternalServiceError
              └── ServiceUnavailableError
```

## Components

| Component | Responsibility |
|-----------|----------------|
| `BaseError` | Abstract base class with common error properties |
| `Error Codes` | Centralized error code constants |
| `Error Types` | Concrete error classes for different scenarios |
| `Error Serializer` | Converts errors to standardized JSON responses |
| `Error Handler` | Global handler for catching and formatting errors |

## Response Format

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "status": 404,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123",
    "details": {}
  }
}
```
