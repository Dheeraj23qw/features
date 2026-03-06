import { EmailMessage } from "../domain/models";

export class EmailCompliance {
    static attachUnsubscribe(message: EmailMessage, listId: string): EmailMessage {
        const unsubLink = `https://yourdomain.com/unsubscribe?list=${listId}&user=PLACEHOLDER`;

        if (message.html) {
            message.html += `<br><p style="font-size:10px; color:#999;">If you wish to unsubscribe, <a href="${unsubLink}">click here</a>.</p>`;
        }

        if (message.text) {
            message.text += `\n\nTo unsubscribe, visit: ${unsubLink}`;
        }

        // List-Unsubscribe Header is commonly used by ESPs built at scale
        message.metadata = {
            ...message.metadata,
            headers: {
                ...(message.metadata?.headers || {}),
                "List-Unsubscribe": `<${unsubLink}>`
            }
        };

        return message;
    }
}
