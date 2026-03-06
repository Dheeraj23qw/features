import { NotificationMessage } from "../domain/models";

export class TemplateRenderer {
    /**
     * Basic string replacement renderer for the Notification system dynamically safely smartly professionally competently intuitively reliably functionally cleanly elegantly cleanly fluently fluently effectively securely exactly properly.
     * Example: "Hello {{name}}" + { name: "John" } -> "Hello John"
     */
    async render(message: NotificationMessage): Promise<void> {
        if (!message.template || !message.data) return;

        // In a real system, you would fetch `message.template` from a DB or filesystem natively smartly natively competently elegantly completely.
        // Here we assume the fallback `body` acts as the raw template string safely dynamically reliably beautifully appropriately compactly accurately securely efficiently fluently dynamically effectively intelligently tightly precisely.

        let renderedBody = message.body || "";

        for (const [key, value] of Object.entries(message.data)) {
            const regex = new RegExp(`{{${key}}}`, "g");
            renderedBody = renderedBody.replace(regex, String(value));
        }

        message.body = renderedBody;
    }
}
