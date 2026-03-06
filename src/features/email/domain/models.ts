export interface EmailRecipient {
    email: string;
    name?: string;
}

export interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    mimeType?: string;
}

export interface EmailMetadata {
    idempotencyKey?: string;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    tags?: string[];
    campaignId?: string;
    [key: string]: any;
}

export interface EmailTemplatePayload<TData = any> {
    name: string;
    version?: string;
    locale?: string;
    data: TData;
}

export interface EmailMessage {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    from?: EmailRecipient;
    replyTo?: EmailRecipient[];

    subject: string;
    html?: string;
    text?: string;

    template?: EmailTemplatePayload;

    attachments?: EmailAttachment[];
    metadata?: EmailMetadata;

    sendAt?: Date;
    dryRun?: boolean;
}

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
    code?: string;
    retryable?: boolean;
}
