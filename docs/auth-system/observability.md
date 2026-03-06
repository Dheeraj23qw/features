# Observability

## AuthEvents

A typed Node.js `EventEmitter` emitting lifecycle events throughout the authentication flows.

**Emitted Events:**

| Event | When |
|-------|------|
| `auth.register` | A new user account is created |
| `auth.login` | A user successfully authenticates |
| `auth.logout` | A session is revoked via logout |
| `auth.failed_login` | Login fails (wrong password / unknown user) |
| `auth.password_reset` | Password reset email is requested |
| `auth.email_verified` | An account is activated via token |
| `auth.mfa_challenge` | MFA is required before issuing tokens |
| `auth.token_refreshed` | A refresh token rotation completes |

## AuthLogger (Structured JSON)

Auto-subscribes to all events and logs clean JSON telemetry to stdout.

**Example log — successful login:**
```json
{
  "level": "info",
  "module": "auth",
  "event": "auth.login",
  "userId": "c3d2e1fc-...",
  "email": "user@example.com",
  "ip": "192.168.1.10",
  "error": null,
  "timestamp": "2026-03-06T03:00:00.000Z"
}
```

**Example log — failed login:**
```json
{
  "level": "warn",
  "module": "auth",
  "event": "auth.failed_login",
  "userId": null,
  "email": "attacker@example.com",
  "ip": "203.0.113.5",
  "error": "Wrong password",
  "timestamp": "2026-03-06T03:01:00.000Z"
}
```

## Custom Event Listeners

Since `AuthEvents` is a standard Node.js `EventEmitter`, you can subscribe externally:

```typescript
import { AuthEvents } from "@/features/auth/events/AuthEvents"; // internal
// or via a custom hook in your app layer
AuthEvents.on("auth.failed_login", (payload) => {
  alertSecurityTeam(payload);
});
```
