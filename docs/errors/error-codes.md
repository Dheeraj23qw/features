# Error Codes

Centralized error codes for consistent error handling across the application.

## Error Code Categories

### General Codes

| Code | Description |
|------|-------------|
| `INTERNAL_ERROR` | Unexpected server error |
| `VALIDATION_ERROR` | Request validation failed |
| `BAD_REQUEST` | Malformed request |

### Authentication Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `INVALID_CREDENTIALS` | Wrong username/password |
| `TOKEN_EXPIRED` | JWT or session expired |
| `TOKEN_INVALID` | Malformed or tampered token |
| `SESSION_EXPIRED` | User session ended |
| `ACCOUNT_LOCKED` | Account temporarily locked |
| `MFA_REQUIRED` | Multi-factor auth required |
| `MFA_INVALID` | Invalid MFA code |

### Authorization Codes

| Code | Description |
|------|-------------|
| `FORBIDDEN` | Access denied |
| `PERMISSION_DENIED` | Missing permission |
| `INSUFFICIENT_PERMISSIONS` | Role too low |
| `ROLE_DENIED` | Required role missing |

### User Codes

| Code | Description |
|------|-------------|
| `USER_NOT_FOUND` | User doesn't exist |
| `USER_ALREADY_EXISTS` | Duplicate user |
| `USER_DISABLED` | Account disabled |
| `EMAIL_NOT_VERIFIED` | Email not confirmed |

### Resource Codes

| Code | Description |
|------|-------------|
| `RESOURCE_NOT_FOUND` | Resource missing |
| `RESOURCE_CONFLICT` | Duplicate resource |
| `RESOURCE_ACCESS_DENIED` | Not owner/admin |

### Rate Limiting Codes

| Code | Description |
|------|-------------|
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `TOO_MANY_REQUESTS` | API throttle |

## HTTP Status Mapping

| Status | Codes |
|--------|-------|
| 400 | `VALIDATION_ERROR`, `BAD_REQUEST` |
| 401 | `UNAUTHORIZED`, `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `MFA_REQUIRED` |
| 403 | `FORBIDDEN`, `PERMISSION_DENIED`, `INSUFFICIENT_PERMISSIONS` |
| 404 | `RESOURCE_NOT_FOUND`, `USER_NOT_FOUND` |
| 409 | `RESOURCE_CONFLICT`, `USER_ALREADY_EXISTS`, `DUPLICATE_ENTRY` |
| 429 | `RATE_LIMIT_EXCEEDED`, `TOO_MANY_REQUESTS` |
| 500 | `INTERNAL_ERROR`, `DATABASE_ERROR` |
| 503 | `SERVICE_UNAVAILABLE`, `EXTERNAL_SERVICE_ERROR` |
