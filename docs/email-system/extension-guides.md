# Extension Guides

The highly modular setup securely ensures extensions require mathematically minimal refactoring efforts.

## Adding a New Template

1. Establish the internal module path directory: `templates/invoice/v1/en.tsx`.
2. Construct the strict React element structure:
   ```tsx
   import { Html, Text } from "@react-email/components";

   // Define strictly typed data props mapped
   export const InvoiceEmail = ({ amount }: { amount: number }) => (
     <Html>
       <Text>Your invoice for ${amount} is ready.</Text>
     </Html>
   );
   export default InvoiceEmail;
   ```
3. Utilize `sendTemplateEmail` and natively parse `{ amount: 100 }` alongside the `data` DOM payload.

## Adding a New ESP Provider

1. Implement the `EmailProvider` adapter instance requirement:
   ```typescript
   import { EmailProvider } from "./registry";
   import { EmailMessage, EmailResult } from "../../domain/models";

   export class CustomProvider implements EmailProvider {
     public name = "custom_provider";

     async send(message: EmailMessage): Promise<EmailResult> {
       // Perform internal node network Rest API requests algorithmically 
       return { success: true, messageId: "custom-123" };
     }
   }
   ```
2. Subscribe the provider class safely globally within `email.service.ts`:
   ```typescript
   providerRegistry.register(new CustomProvider());
   providerRegistry.setFallbackChain(["resend", "custom_provider"]);
   ```
