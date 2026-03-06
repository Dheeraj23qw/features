import { EmailProvider } from "./registry";
import { EmailMessage, EmailResult } from "../../domain/models";

export class SESProvider implements EmailProvider {
    public name = "ses";

    async send(message: EmailMessage): Promise<EmailResult> {
        console.log(`[SESProvider] Mock sending email to ${message.to[0].email} via AWS SES`);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
            success: true,
            messageId: `ses-${Date.now()}`,
        };
    }
}
