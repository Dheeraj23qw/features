# Error Types

The module provides various typed error classes for different scenarios.

## Base Error

All errors extend from `BaseError`:

```typescript
class BaseError extends Error {
  code: string;
  statusCode: number;
  metadata: Record<string, unknown>;
  isOperational: boolean;
  timestamp: Date;
}
```

## Validation Errors (400)

```typescript
import { ValidationError, BadRequestError } from "@/features/errors";

throw new ValidationError("Invalid email format", { field: "email" });
throw new BadRequestError("Missing required field: name");
```

## Authentication Errors (401)

```typescript
import { 
  AuthenticationError,
  InvalidCredentialsError,
  TokenExpiredError,
  TokenInvalidError,
  AccountLockedError,
  MFARequiredError,
} from "@/features/errors";

throw new AuthenticationError("Please log in to continue");
throw new InvalidCredentialsError("Wrong password");
throw new TokenExpiredError("Session expired, please login again");
throw new AccountLockedError("Account locked due to too many attempts");
```

## Authorization Errors (403)

```typescript
import { 
  AuthorizationError,
  PermissionDeniedError,
  InsufficientPermissionsError,
} from "@/features/errors";

throw new AuthorizationError("Access denied");
throw new PermissionDeniedError("You don't have permission");
throw new InsufficientPermissionsError({ required: "ADMIN" });
```

## Not Found Errors (404)

```typescript
import { NotFoundError, UserNotFoundError } from "@/features/errors";

throw new NotFoundError("Resource not found");
throw new UserNotFoundError("User with ID 123 not found");
```

## Conflict Errors (409)

```typescript
import { 
  ConflictError,
  UserAlreadyExistsError,
  DuplicateEntryError,
} from "@/features/errors";

throw new ConflictError("Resource already exists");
throw new UserAlreadyExistsError("Email already registered");
```

## Server Errors (500)

```typescript
import { 
  InternalServerError,
  DatabaseError,
  ExternalServiceError,
  ServiceUnavailableError,
} from "@/features/errors";

throw new InternalServerError("Something went wrong");
throw new DatabaseError("Failed to connect to database");
throw new ExternalServiceError("Payment service unavailable");
```

## Operational vs Programming Errors

- **Operational Errors**: Expected errors (validation, auth failures) - `isOperational: true`
- **Programming Errors**: Unexpected bugs - `isOperational: false`

```typescript
// Operational - expected to happen
throw new ValidationError("Invalid input");

// Non-operational - unexpected bug
throw new InternalServerError("Cannot read property of undefined", {}, false);
```
