# Security Layer

## Password Hashing (`PasswordHasher`)
- Uses **bcryptjs** with `saltRounds = 12` (OWASP recommended minimum).
- `bcrypt.compare` is inherently **timing-safe**, preventing timing attacks.
- Plain passwords are **never logged or stored**.

## JWT Signing (`TokenSigner`)
- Wraps `jsonwebtoken.sign` / `verify` with proper error mapping.
- `TokenExpiredError` and `TokenInvalidError` are returned instead of raw JWT exceptions, preventing library internals from leaking to clients.

## Brute-Force Protection (`BruteForceProtection`)
Three-phase lifecycle per login identifier (email):

```
check()       → Reject if currently locked
login fails   → recordFailure() → increment counter → lock if >= MAX_LOGIN_ATTEMPTS
login passes  → reset() → clear counter
```

Configuration via environment variables:
```env
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
```

## MFA (`MFAService`)
Supports two methods:

### TOTP (Time-Based OTP)
1. Generate a base32 secret: `generateTOTPSecret()`
2. Create an `otpauth://` URI for user to scan with Authenticator app: `getTOTPUri(email, secret)`
3. Store encrypted secret on the `User`.
4. On each login, call `verifyTOTP(secret, inputCode)` — delegates to **otplib** in production.

### Email OTP
1. Generate a 6-digit numeric code: `generateEmailCode(userId)` — auto-expires in **10 minutes**.
2. Send the code via the Email Feature Module.
3. On code submission: `verifyEmailCode(userId, code)`.
