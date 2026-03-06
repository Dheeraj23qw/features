# Provider Architecture

The Enterprise Email Module avoids dependency on a single vendor by abstracting actual sending logic behind an adapter interface.

## Provider Interface

Every provider must implement this interface:

```typescript
import { EmailMessage, EmailResult } from "../../domain/models";

export interface EmailProvider {
  name: string;
  send(message: EmailMessage): Promise<EmailResult>;
}
```

## Provider Registry

The `ProviderRegistry` manages instantiation and failover.

```typescript
import { providerRegistry } from "./registry";
import { ResendProvider } from "./resend";
import { SendGridProvider } from "./sendgrid";

providerRegistry.register(new ResendProvider(), true); // Primary
providerRegistry.register(new SendGridProvider());

// Set fallback chain
providerRegistry.setFallbackChain(["resend", "sendgrid"]);
```

## The Fallback Loop

If `providerRegistry.getPrimaryProvider().send()` throws a network error, the Queue catches it natively, logs the failure, and reads `providerRegistry.getNextFallback("resend")`. 

It will immediately retry the exact same `EmailMessage` payload against the secondary configuration safely isolated from application logic.
