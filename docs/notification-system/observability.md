# Observability & Logging

The notification system emits structured events and JSON logs for monitoring and debugging.

## Event Emitter

The system emits typed events for all notification lifecycle actions:

| Event | Description |
|-------|-------------|
| `notification.created` | Notification queued for delivery |
| `notification.sent` | Successfully delivered to provider |
| `notification.retry` | Delivery attempt failed, retrying |
| `notification.failed` | All retry attempts exhausted |
| `notification.dropped` | Dropped (duplicate, rate limited, etc.) |

## JSON Logging

All logs are structured JSON for easy parsing by log aggregation systems:

```json
{
  "level": "warn",
  "feature": "notification",
  "event": "notification_retry",
  "messageId": "notif_idemp_user443",
  "channel": "EMAIL",
  "data": { "attempt": 2 }
}
```

## Log Fields

| Field | Description |
|-------|-------------|
| `level` | Log level (debug, info, warn, error) |
| `feature` | Always "notification" |
| `event` | Specific event name |
| `messageId` | Unique notification identifier |
| `channel` | Target delivery channel |
| `data` | Additional event-specific data |
