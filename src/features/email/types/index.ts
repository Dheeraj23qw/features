import * as domain from "../domain/models";

export * from "../domain/models";

export interface EmailProvider {
    name: string;
    send(message: domain.EmailMessage): Promise<domain.EmailResult>;
}
