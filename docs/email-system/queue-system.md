# Queue System

The `MemoryQueue` buffers all egress traffic to ensure application reliability. In a distributed environment, this adapter scales smoothly outside of process nodes to external clients like Redis or BullMQ.

## Features

### 1. Token Bucket Rate Limiting
ESPs often enforce rigorous rate ceilings. The adapter implements a Token Bucket natively:
- A background ticker replenishes tokens (default 10) every 1000ms.
- Jobs `await waitForToken()` securely before resolving network calls.

### 2. Idempotency Protection
To prevent duplicate payload sending errors gracefully (e.g. clicking "Checkout" twice):
```typescript
{
  metadata: { idempotencyKey: "invoice-123" }
}
```
The Queue caches this key. A subsequent burst with the same key safely resolves instantly without hitting the ESP.

### 3. Chronological Scheduling
An internal background loop evaluates jobs sorted chronologically mathematically.
```typescript
{ sendAt: new Date(Date.now() + 60000) } // Send in 1 minute
```
The Queue will park this object natively until `Date.now() >= sendAt` evaluates true.

### 4. Priority Queuing
If there's an internal backlog bottleneck, priority overrides normal chronological FIFO processing algorithms.
```typescript
{ metadata: { priority: "HIGH" } }
```
`HIGH` overrides `MEDIUM`, ensuring transactional authentication emails skip bulk marketing delays automatically.
