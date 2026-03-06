# Queue Engine

The `NotificationQueue` handles asynchronous processing of notifications with priority scheduling and retry logic.

## Queue Processing

- Processes notifications asynchronously from a queue
- Supports priority-based scheduling (HIGH priority messages processed first)
- Implements exponential backoff for retries

## Scheduled Priority Sorting

Messages with `priority: HIGH` are processed before normal and low priority messages.

## Retry Strategy

Exponential backoff formula:
```
delay = baseDelay * 2^attempt
```

```typescript
const delayMs = RetryStrategy.getBackoffDelay(msg.retryAttempts - 1);
msg.scheduleAt = new Date(Date.now() + delayMs);
```

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `NOTIFICATION_QUEUE_CONCURRENCY` | Max concurrent processing | 5 |
| `NOTIFICATION_RETRY_ATTEMPTS` | Max retry attempts | 3 |
| `NOTIFICATION_QUEUE_STORE` | Queue storage backend | "memory" |
