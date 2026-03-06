import { EmailProvider } from "./registry";
import { EmailMessage, EmailResult } from "../../domain/models";

export class SMTPProvider implements EmailProvider {
    public name = "smtp";

    async send(message: EmailMessage): Promise<EmailResult> {
        console.log(`[SMTPProvider] Mock sending email to ${message.to[0].email} with subject: ${message.subject}`);
        // Simulate SMTP network call
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            success: true,
            messageId: `smtp-${Date.now()}`,
        };
    }
}
