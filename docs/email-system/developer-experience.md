# Developer Experience (DevX)

Configuring `EMAIL_MODE=development` prevents massive deployment headaches when testing complex authentication or transactional flows locally across Node instances.

## Development Sink Mode

When `EMAIL_MODE=development` is detected synchronously inside `utils/config.ts`:
1. `EmailService` instantly intercepts the entire `EmailMessage` payload block.
2. It aggressively rewrites `message.to`, `message.cc`, and `message.bcc` arrays natively overriding all scopes.
3. It maps the newly mutated array values securely isolated referencing `DEV_INBOX_EMAIL`.

*Result*: You can trigger live production flows locally across microservices securely, but the real users never receive any test emails locally dispatched. The testing payloads arrive directly to the engineer's configured test inbox cleanly routed.

## Dry Run Interceptor

If you want to view local debug console behavior natively without firing network scopes algorithmically:
```typescript
await sendEmail({
  to: [{ email: "nobody@example.com" }],
  subject: "Testing",
  dryRun: true // Intercepts queue placement
});
```
The internal node logger natively tracks and dumps the compiled JSON result synchronously resolving a mocked schema `messageId` protecting against heavy testing latency delays or account lockouts.
