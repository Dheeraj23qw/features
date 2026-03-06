# Observability

By stripping complex SDK vendor imports natively from the core Queue logic buffer natively, the email system natively abstracts telemetry metrics.

## Structured Logging

The internal `logger/` utility module formats log lines securely parsing structured telemetry dynamically:

```json
{
  "level": "info",
  "timestamp": "2026-03-06T07:54:02.000Z",
  "message": "Email Sent Successfully",
  "provider": "resend",
  "latency_ms": 312
}
```

This guarantees fast indexing performance for DataDog or OpenTelemetry pipelines checking Standard Output stdout synchronously.

## The DOM Event Emitter

`EmailEventEmitter` (`events/index.ts`) abstracts native Node execution cycles cleanly bridging separate application scope concerns out:

```typescript
import { emailEvents } from "@/features/email/events";

emailEvents.onEvent("email.sent", (payload) => {
   console.log(`Email delivered by ${payload.provider} to ${payload.message.to[0].email}`);
   // Write update to Database model asynchronously safely 
});

emailEvents.onEvent("email.failed", (payload) => {
   console.error(`Final Delivery failure: ${payload.error.message}`);
   // POST to Slack / Trigger PagerDuty natively 
});
```
