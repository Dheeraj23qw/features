# Routing Logic & Fallbacks

The `NotificationRouter` determines which provider to use for each notification channel and handles fallback logic when a delivery fails.

## Routing Algorithm

1. Queue extracts `msg.channels` (e.g., `["EMAIL"]`)
2. Routes to the provider registered for that channel
3. If delivery fails, looks up the explicit fallback chain

## Fallback Chain

```typescript
static getFallbackChannel(failedChannel: NotificationChannel): NotificationChannel | null {
    switch (failedChannel) {
        case NotificationChannel.EMAIL:
            return NotificationChannel.PUSH;
        case NotificationChannel.PUSH:
            return NotificationChannel.SMS;
        case NotificationChannel.SMS:
            return NotificationChannel.EMAIL; 
    }
}
```

## Fallback Rules

| Failed Channel | Fallback |
|----------------|----------|
| EMAIL | PUSH |
| PUSH | SMS |
| SMS | EMAIL |

The fallback chain is circular - if all channels fail, the notification is marked as failed.
