# Error Handler

The module provides utilities for handling errors in your application.

## createErrorHandler

Create a global error handler for your application:

```typescript
import { createErrorHandler } from "@/features/errors";

const handleError = createErrorHandler({
  includeStack: false,        // Show stack traces (default: false)
  includeMetadata: true,      // Include error metadata (default: true)
  logErrors: true,            // Log errors to console (default: true)
  onError: (error) => {
    // Send to error tracking service
    Sentry.captureException(error);
  },
});
```

## Usage with Next.js

```typescript
// pages/api/error.ts
import { createErrorHandler, serializeError } from "@/features/errors";

const handleError = createErrorHandler({
  logErrors: true,
});

export default function handler(req, res) {
  try {
    // Your route logic
  } catch (error) {
    const response = handleError(error, {
      requestId: req.headers["x-request-id"],
      path: req.url,
      method: req.method,
    });
    
    res.status(response.error.status).json(response);
  }
}
```

## Usage with Express

```typescript
import { createErrorHandler, serializeError } from "@/features/errors";

const handleError = createErrorHandler({
  logErrors: true,
  onError: (error) => {
    // Custom error reporting
  },
});

app.use((err, req, res, next) => {
  const response = handleError(err, {
    requestId: req.headers["x-request-id"],
    path: req.path,
    method: req.method,
  });
  
  res.status(response.error.status).json(response);
});
```

## serializeError

Manually serialize an error:

```typescript
import { serializeError, ValidationError } from "@/features/errors";

try {
  throw new ValidationError("Invalid email");
} catch (error) {
  const response = serializeError(error, {
    includeStack: true,
    includeMetadata: true,
    requestId: "req-123",
  });
  
  console.log(response);
}

// Output:
// {
//   error: {
//     code: "VALIDATION_ERROR",
//     message: "Invalid email",
//     status: 400,
//     timestamp: "2024-01-15T10:30:00.000Z",
//     requestId: "req-123"
//   }
// }
```

## getStatusCode

Extract HTTP status code from any error:

```typescript
import { getStatusCode, NotFoundError } from "@/features/errors";

const error = new NotFoundError("User not found");
const status = getStatusCode(error); // 404
```

## Stack Trace Control

In production, stack traces are hidden by default:

```typescript
// Development
serializeError(error); 
// Includes stack trace if available

// Production (NODE_ENV=production)
serializeError(error);
// Stack trace hidden, generic message shown
```
