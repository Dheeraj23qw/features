# Security Layer

The Security Firewall and Compliance engines run synchronously before emails enter the asynchronous queue layout, ensuring validation happens fast.

## Firewall Validation

The `EmailSecurityFirewall.validate(message)` utility actively scans the `to` list string parts.
- **Blocklists**: Checks domain maps against `["spam.com", "malicious.net"]`.
- **Disposable Detection**: Rejects testing nodes via regex (`/tempmail|10minutemail/i`) instantly preventing queue memory bloat and ESP blocklisting loops securely.

If security intercepts maliciously malformed payloads it instantly throws a `SECURITY_VIOLATION` code error safely upwards.

## Compliance Injection

The compliance engine modifies the final message structures synchronously proxy tracking pixels and standardizes securely `<a href>` Unsubscribe mechanics mathematically:

```typescript
import { EmailCompliance } from "../security/compliance";

let message = { html: "<p>Hello</p>", ... };
// Automatically pushes "List-Unsubscribe" SMTP headers to the payload natively:
message = EmailCompliance.attachUnsubscribe(message, "marketing-list-id");
```
