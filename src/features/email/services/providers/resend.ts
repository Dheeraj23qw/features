import { Resend } from "resend";
import { EmailProvider } from "./registry";
import { EmailMessage, EmailResult } from "../../domain/models";
import { getEmailConfig } from "../../utils/config";

export class ResendProvider implements EmailProvider {
    public name = "resend";
    private resend: Resend;
    private defaultFrom: string;

    constructor() {
        const config = getEmailConfig();
        this.resend = new Resend(config.RESEND_API_KEY || "dummy-key");
        this.defaultFrom = config.DEFAULT_FROM_EMAIL || "onboarding@resend.dev";
    }

    async send(message: EmailMessage): Promise<EmailResult> {
        try {
            const fromEmail = message.from ? `${message.from.name ? message.from.name + ' <' + message.from.email + '>' : message.from.email}` : this.defaultFrom;

            const toEmails = message.to.map(t => t.email);
            const ccEmails = message.cc?.map(c => c.email);
            const bccEmails = message.bcc?.map(b => b.email);
            const replyToEmails = message.replyTo?.map(r => r.email);

            const payload: any = {
                from: fromEmail,
                to: toEmails,
                subject: message.subject,
            };

            if (ccEmails && ccEmails.length > 0) payload.cc = ccEmails;
            if (bccEmails && bccEmails.length > 0) payload.bcc = bccEmails;
            if (replyToEmails && replyToEmails.length > 0) payload.reply_to = replyToEmails;

            if (message.html) {
                payload.html = message.html;
            } else if (message.text) {
                payload.text = message.text;
            } else {
                payload.text = " ";
            }

            if (message.attachments && message.attachments.length > 0) {
                payload.attachments = message.attachments.map(att => ({
                    filename: att.filename,
                    content: att.content,
                }));
            }

            const response = await this.resend.emails.send(payload);

            if (response.error) {
                return {
                    success: false,
                    error: response.error.message,
                    code: response.error.name,
                    // If the error represents a timeout or server issue, we flag retryable=true
                    retryable: response.error.name === "application_error" || response.error.name === "internal_server_error",
                };
            }

            return {
                success: true,
                messageId: response.data?.id,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Unknown error occurred while sending email via Resend",
                retryable: true,
            };
        }
    }
}
