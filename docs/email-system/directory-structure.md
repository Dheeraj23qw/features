# Directory Structure

The module is self-contained within `src/features/email/`. No other directory should contain core email logic.

```text
src/features/email/
├── api/
│   └── index.ts                # The rigidly controlled public API boundary.
├── domain/
│   └── models.ts               # Core DDD interfaces (`EmailMessage`).
├── events/
│   └── index.ts                # Node.js EventEmitter for decoupled async hooks.
├── logger/
│   └── index.ts                # Structured JSON logger.
├── queue/
│   └── index.ts                # In-memory Adapter (Buffer, Rate Limiter).
├── security/
│   ├── compliance.ts           # Automatic injection of Legal standards (Unsubscribe).
│   └── firewall.ts             # Disposable Email blocking & domain blocklists.
├── services/
│   ├── providers/
│   │   ├── registry.ts         # The dynamic Plugin Orchestrator and Fallback Chain.
│   │   ├── resend.ts           # Resend Provider adapter implementation.
│   │   ├── sendgrid.ts         # SendGrid Provider adapter implementation.
│   │   ├── ses.ts              # Amazon SES Provider adapter implementation.
│   │   └── smtp.ts             # Raw SMTP Provider adapter implementation.
│   └── email.service.ts        # The Singleton Orchestrator processing tasks.
├── templates/
│   ├── renderer/
│   │   └── index.ts            # Dynamic filesystem loader for .tsx React Email files.
│   ├── welcome/
│   │   └── v1/
│   │       └── en.tsx          # A strictly typed template component.
│   └── ...
├── tracking/
│   └── index.ts                # Open Pixels and Click-tracking tools.
├── utils/
│   ├── config.ts               # Zod-validated environment & DEV variables.
│   └── errors.ts               # Standardized Error handling.
└── index.ts                    # The unified export boundary.
```
