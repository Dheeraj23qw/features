# Domain Models

The Domain Model layer enforces structural boundaries, preventing fragmented typed objects from littering the system.

## `EmailMessage`

This is the only object type accepted by the Queue and Providers. Third-party configurations are strictly mapped down at the provider level.

```typescript
export interface EmailMessage {
  to: EmailRecipient[];         // e.g. [{ email: "john@example.com" }]
  subject: string;
  from?: EmailRecipient;
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  metadata?: EmailMetadata;
  sendAt?: Date;                // Defines when the email should dispatch chronologically
  dryRun?: boolean;             // Bypasses the queue and logs payload
}
```

## `EmailMetadata`

Metadata adds operational controls explicitly isolated from content constraints. It controls advanced queue behaviors.

```typescript
export interface EmailMetadata {
  idempotencyKey?: string;      // Solves duplicate send attempts in the queue cache.
  priority?: "HIGH" | "MEDIUM" | "LOW"; // Interpreted by the queue's internal sorting blocker.
  tags?: Record<string, string>;
  headers?: Record<string, string>;     // E.g., for List-Unsubscribe implementations.
}
```
