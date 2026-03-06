# Token System

The auth module manages four distinct token types via `TokenService`.

## Token Types

| Type | Purpose | Expiry |
|------|---------|--------|
| **Access Token** (JWT) | Stateless auth for every API request | `JWT_EXPIRES_IN` (default 15m) |
| **Refresh Token** (UUID) | Renew access tokens without re-login | `REFRESH_TOKEN_EXPIRES_DAYS` (default 7d) |
| **Email Verification Token** | Activate account after registration | `EMAIL_TOKEN_EXPIRES_MINUTES` (default 60m) |
| **Password Reset Token** | Authorize a password change | `EMAIL_TOKEN_EXPIRES_MINUTES` (default 60m) |

## Access Token Payload

```json
{
  "userId": "abc-123",
  "email": "user@example.com",
  "roles": ["USER"],
  "permissions": ["READ_CONTENT"],
  "iat": 1700000000,
  "exp": 1700000900
}
```

Permissions are **pre-resolved** from the role map at token issuance time — no database lookup on every request.

## Refresh Token Rotation

Every call to `refreshToken()` executes a full **token rotation**:
1. Old refresh token is marked as `used` in `TokenStore`.
2. Old session is revoked.
3. A brand new refresh token + session is created.
4. A new access token is issued.

This prevents **refresh token reuse attacks**. If an attacker steals a used token, the call will fail with `TOKEN_INVALID`.

## Environment Variables

```env
JWT_SECRET=<at-least-32-characters>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_DAYS=7
EMAIL_TOKEN_EXPIRES_MINUTES=60
```
