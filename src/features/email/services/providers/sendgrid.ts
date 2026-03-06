import { EmailProvider } from "./registry";
import { EmailMessage, EmailResult } from "../../domain/models";

export class SendGridProvider implements EmailProvider {
    public name = "sendgrid";

    async send(message: EmailMessage): Promise<EmailResult> {
        console.log(`[SendGridProvider] Mock sending email to ${message.to[0].email} via SendGrid`);

        await new Promise((resolve) => setTimeout(resolve, 400));

        return {
            success: true,
            messageId: `sg-${Date.now()}`,
        };
    }
}
