# Observability

## UserEvents

A typed Node.js `EventEmitter` emitting events throughout the user management lifecycle.

**Emitted Events:**

| Event | When |
|-------|------|
| `user.created` | A new user record is created |
| `user.updated` | Core user fields (username, role) are changed |
| `user.deleted` | A user is soft-deleted |
| `user.role_changed` | A user's role is explicitly reassigned |
| `user.profile_updated` | Profile fields (bio, avatar, etc.) are changed |
| `user.preferences_updated` | Preferences (theme, language, etc.) are changed |
| `user.suspended` | A user's status is set to SUSPENDED |
| `user.activated` | A user's status is set back to ACTIVE |

## UserLogger (Structured JSON)

Auto-initializes on module load and subscribes to all `UserEvents`.

**Example log — profile update:**
```json
{
  "level": "info",
  "module": "user",
  "event": "user.profile_updated",
  "userId": "c3d2e1fc-...",
  "changes": ["bio", "avatarUrl"],
  "actorId": "admin-uuid",
  "timestamp": "2026-03-06T03:10:00.000Z"
}
```

**Example log — soft-delete:**
```json
{
  "level": "warn",
  "module": "user",
  "event": "user.deleted",
  "userId": "c3d2e1fc-...",
  "changes": null,
  "actorId": "admin-uuid",
  "timestamp": "2026-03-06T03:11:00.000Z"
}
```

## Custom Listeners

```typescript
import { UserEvents } from "@/features/user/events/UserEvents"; // internal

UserEvents.on("user.role_changed", ({ userId, actorId }) => {
  auditService.record("ROLE_CHANGE", { userId, actorId });
});
```
