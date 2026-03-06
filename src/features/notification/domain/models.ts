import { NotificationChannel, NotificationPriority } from "./enums";

export interface NotificationMessage {
    id: string;                               // Unique idempotent key
    userId?: string;                          // Resolved to a contact medium later
    channels: NotificationChannel[];          // e.g. ["EMAIL", "PUSH"]
    title?: string;
    body?: string;
    template?: string;                        // e.g. "welcome_email"
    data?: Record<string, any>;               // Template hydration variables

    priority?: NotificationPriority;          // Queue sorting order
    metadata?: Record<string, any>;           // Pass-through tracking variables

    scheduleAt?: Date;                        // Delay sending
    retryAttempts?: number;                   // Natively track current fail states

    // Optional targeted overrides if userId isn't utilized natively
    emailTarget?: string;
    phoneTarget?: string;
    pushToken?: string;
    webhookUrl?: string;
}
