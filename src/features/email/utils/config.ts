import { z } from "zod";

const emailConfigSchema = z.object({
    EMAIL_PROVIDER: z.enum(["resend", "smtp", "sendgrid", "ses"]).default("resend"),
    RESEND_API_KEY: z.string().optional(),
    DEFAULT_FROM_EMAIL: z.string().email().optional(),

    // Developer Experience fields
    EMAIL_MODE: z.enum(["production", "development"]).default("production"),
    DEV_INBOX_EMAIL: z.string().email().optional(),
    EMAIL_RATE_LIMIT: z.string().default("10/sec"),
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export const getEmailConfig = (): EmailConfig => {
    const parsed = emailConfigSchema.safeParse({
        EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        DEFAULT_FROM_EMAIL: process.env.DEFAULT_FROM_EMAIL || "onboarding@resend.dev",
        EMAIL_MODE: process.env.EMAIL_MODE || "production",
        DEV_INBOX_EMAIL: process.env.DEV_INBOX_EMAIL,
        EMAIL_RATE_LIMIT: process.env.EMAIL_RATE_LIMIT,
    });

    if (!parsed.success) {
        console.error("❌ Invalid Email Configuration:", parsed.error.format());
        throw new Error("Invalid Email Configuration");
    }

    return parsed.data;
};
