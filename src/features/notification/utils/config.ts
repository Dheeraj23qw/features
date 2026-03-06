import { z } from "zod";

const notificationEnvSchema = z.object({
    NOTIFICATION_QUEUE_CONCURRENCY: z.coerce.number().default(5),
    NOTIFICATION_RETRY_ATTEMPTS: z.coerce.number().default(3),
    NOTIFICATION_QUEUE_STORE: z.enum(["memory", "redis"]).default("memory"),
    EMAIL_PROVIDER: z.string().default("EmailStub"),
    SMS_PROVIDER: z.string().default("SMSStub"),
    PUSH_PROVIDER: z.string().default("PushStub"),
});

export type NotificationGlobalConfig = z.infer<typeof notificationEnvSchema>;

export const getNotificationConfig = (): NotificationGlobalConfig => {
    const parsed = notificationEnvSchema.safeParse({
        NOTIFICATION_QUEUE_CONCURRENCY: process.env.NOTIFICATION_QUEUE_CONCURRENCY,
        NOTIFICATION_RETRY_ATTEMPTS: process.env.NOTIFICATION_RETRY_ATTEMPTS,
        NOTIFICATION_QUEUE_STORE: process.env.NOTIFICATION_QUEUE_STORE,
        EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
        SMS_PROVIDER: process.env.SMS_PROVIDER,
        PUSH_PROVIDER: process.env.PUSH_PROVIDER,
    });

    if (!parsed.success) {
        console.error("❌ Invalid Notification Configuration:", parsed.error.format());
        throw new Error("Invalid Notification Configuration");
    }

    return parsed.data;
};
