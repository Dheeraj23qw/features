# Security & Safety

## Local Rate Limiting

The service enforces per-user rate limits to prevent abuse.

- **Sliding Window**: Default 60000ms window
- **Max Requests**: 50 requests per window per userId
- **Response**: Returns HTTP 429 when limit exceeded

```typescript
const isAllowed = await rateLimiter.check(userId);
if (!isAllowed) {
  throw new RateLimitExceededError();
}
```

## Deduplication (Idempotency)

The deduplication engine prevents duplicate notification deliveries using message ID tracking.

```typescript
const isUnique = await this.deduplicator.checkUnique(message);
if (!isUnique) {
    this.events.emit("notification.dropped", message, undefined, "Duplicate");
}
```

## Security Best Practices

- Never log sensitive notification content
- Sanitize webhook URLs before making requests
- Validate all incoming message payloads with Zod
- Rotate provider API keys regularly
