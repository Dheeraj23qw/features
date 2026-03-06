import { EmailMessage } from "../domain/models";

const blocklistDomains = new Set(["spam.com", "malicious.net", "disposable.email"]);
const disposableRegex = /tempmail|guerrillamail|10minutemail/i;

export class EmailSecurityFirewall {
    static validate(message: EmailMessage): boolean {
        for (const recipient of message.to) {
            const parts = recipient.email.split("@");
            if (parts.length !== 2) return false;

            const domain = parts[1].toLowerCase();

            if (blocklistDomains.has(domain)) {
                throw new Error(`Domain ${domain} is blocklisted.`);
            }

            if (disposableRegex.test(domain)) {
                throw new Error(`Disposable email providers are not permitted.`);
            }
        }
        return true;
    }
}
