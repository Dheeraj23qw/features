# Usage

Examples of using the error handling module.

## Basic Usage

```typescript
import { NotFoundError, ValidationError } from "@/features/errors";

// In a service
async function getUser(userId: string) {
  const user = await db.users.find(userId);
  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }
  return user;
}

// In a controller
async function updateUser(req, res) {
  const { userId } = req.params;
  const { email } = req.body;
  
  if (!email) {
    throw new ValidationError("Email is required", { field: "email" });
  }
  
  // Update user...
}
```

## Custom Metadata

Add contextual information to errors:

```typescript
throw new ValidationError("Invalid input", {
  field: "email",
  value: "invalid-email",
  constraints: ["must be valid email"],
});

throw new NotFoundError("User not found", {
  userId: "123",
  searchedBy: "admin",
});
```

## Error Handler Integration

```typescript
import { createErrorHandler, serializeError, BaseError } from "@/features/errors";

const handleError = createErrorHandler({
  logErrors: true,
  onError: (error) => {
    if (error instanceof BaseError && !error.isOperational) {
      // Alert on unexpected errors
      alertTeam(error);
    }
  },
});

export async function apiHandler(req, res) {
  try {
    return await routeHandler(req);
  } catch (error) {
    const response = handleError(error, {
      requestId: req.headers["x-request-id"],
    });
    
    return res
      .status(response.error.status)
      .json(response);
  }
}
```

## Type Guards

Check error types:

```typescript
import { 
  BaseError, 
  isOperationalError,
  NotFoundError,
  ValidationError,
} from "@/features/errors";

function handleError(error: unknown) {
  // Check if operational error
  if (isOperationalError(error)) {
    console.log("Expected error:", error.message);
  } else {
    console.log("Unexpected error, alert team!");
  }
  
  // Check specific types
  if (error instanceof NotFoundError) {
    // Handle not found
  } else if (error instanceof ValidationError) {
    // Handle validation
  }
}
```

## Best Practices

1. **Use specific errors**: Throw the most specific error type
2. **Add metadata**: Include context for debugging
3. **Mark operational errors**: Set `isOperational: true` for expected errors
4. **Handle in middleware**: Use global error handler for uncaught errors
5. **Don't expose internals**: Hide stack traces in production
