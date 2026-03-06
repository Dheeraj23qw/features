# Rate Limiting Strategies

The module implements three throttling algorithms.

## 1. Fixed Window Strategy

Divides time into fixed intervals. Requests are counted within each interval.

**Algorithm:**
```typescript
const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
const key = `${windowStart}:${identifier}`;
```

**Pros:** Simple implementation, low storage overhead
**Cons:** Vulnerable to burst traffic at window boundaries

## 2. Sliding Window Strategy

Tracks requests in a rolling window that moves with time.

**Algorithm:**
```typescript
const timePassed = now - currentWindowStart;
const weightOfPrevious = 1 - (timePassed / windowMs);
const estimatedRequests = (previousCount * weightOfPrevious) + currentCount;
```

**Pros:** Smoother traffic shaping, no boundary burst
**Cons:** More complex storage queries

## 3. Token Bucket Strategy

Maintains a bucket of tokens that refills at a steady rate.

**Algorithm:**
```typescript
const refillRate = limit / windowMs;
const currentTokens = Math.min(capacity, previousTokens + (timePassed * refillRate));
```

**Pros:** Allows burst capacity, accurate for continuous traffic
**Cons:** Requires atomic operations for consistency

## Choosing a Strategy

| Strategy | Use Case |
|----------|----------|
| Fixed Window | Simple APIs, low traffic |
| Sliding Window | APIs needing smooth limits |
| Token Bucket | APIs with burst traffic patterns |
