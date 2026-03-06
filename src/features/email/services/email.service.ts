import { MemoryQueue } from "../queue";
import { providerRegistry } from "./providers/registry";
import { ResendProvider } from "./providers/resend";
import { SendGridProvider } from "./providers/sendgrid";
import { SESProvider } from "./providers/ses";
import { EmailMessage, EmailResult } from "../domain/models";
import { TemplateRenderer, RendererOptions } from "../templates/renderer";
import { getEmailConfig } from "../utils/config";
import { EmailSecurityFirewall } from "../security/firewall";

export class EmailService {
    private queue: MemoryQueue;
    private renderer: TemplateRenderer;
    private config = getEmailConfig();

    constructor() {
        // Register multiple providers
        providerRegistry.register(new ResendProvider(), true);
        providerRegistry.register(new SendGridProvider());
        providerRegistry.register(new SESProvider());

        // Establish a resilient fallback chain
        providerRegistry.setFallbackChain(["resend", "sendgrid", "ses"]);

        // Instantiate core orchestrators
        this.renderer = new TemplateRenderer();
        this.queue = new MemoryQueue();
    }

    /**
     * Applies Developer Experience interceptions (Dry Run, Dev Inbox Redirect).
     */
    private applyDevInterventions(message: EmailMessage): EmailResult | EmailMessage {
        if (message.dryRun) {
            console.log("🛠️ [EmailService] DRY RUN intercepted. Email not sent.", JSON.stringify(message, null, 2));
            return { success: true, messageId: "dry-run" };
        }

        if (this.config.EMAIL_MODE === "development") {
            if (this.config.DEV_INBOX_EMAIL) {
                console.warn(`🛠️ [EmailService] Dev mode active. Redirecting email to ${this.config.DEV_INBOX_EMAIL}`);
                message.to = [{ email: this.config.DEV_INBOX_EMAIL, name: "Dev Inbox" }];
                message.cc = [];
                message.bcc = [];
            } else {
                console.warn("🛠️ [EmailService] Dev mode active but no dev inbox set. Logging email instead.");
                console.log(JSON.stringify(message, null, 2));
                return { success: true, messageId: "dev-log" };
            }
        }

        return message;
    }

    /**
     * Sends a raw email using the queue adapter, with full security checks and hooks.
     */
    async sendEmail(message: EmailMessage): Promise<EmailResult> {
        try {
            EmailSecurityFirewall.validate(message);
        } catch (e: any) {
            return { success: false, error: e.message, code: "SECURITY_VIOLATION" };
        }

        const processed = this.applyDevInterventions(message);
        if ('success' in processed) return processed; // Was intercepted by dry run or log mode

        return this.queue.process(processed as EmailMessage);
    }

    /**
     * Bulk generic sending. Sends independently.
     */
    async sendBulkEmail(messages: EmailMessage[]): Promise<EmailResult[]> {
        return Promise.all(messages.map(m => this.sendEmail(m)));
    }

    /**
     * Sends an email using the Template Rendering engine.
     */
    async sendTemplateEmail(
        baseMessage: Omit<EmailMessage, "html" | "text" | "subject">,
        templateOpts: RendererOptions
    ): Promise<EmailResult> {
        try {
            const { html, text, subject } = await this.renderer.render(templateOpts);

            return this.sendEmail({
                ...baseMessage,
                subject,
                html,
                text,
                template: {
                    name: templateOpts.name,
                    version: templateOpts.version,
                    locale: templateOpts.locale,
                    data: templateOpts.data
                }
            });
        } catch (error: any) {
            console.error(`❌ [EmailService] Failed to compile template: ${error.message}`);
            return {
                success: false,
                error: `Template compilation failed: ${error.message}`,
                code: "TEMPLATE_ERROR"
            };
        }
    }
}

// Export a singleton instance for direct usage
export const emailService = new EmailService();

// Export convenient helper functions
export const sendEmail = (message: EmailMessage) => emailService.sendEmail(message);
export const sendBulkEmail = (messages: EmailMessage[]) => emailService.sendBulkEmail(messages);
export const sendTemplateEmail = (
    baseMessage: Omit<EmailMessage, "html" | "text" | "subject">,
    templateOpts: RendererOptions
) => emailService.sendTemplateEmail(baseMessage, templateOpts);
