export enum NotificationChannel {
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    SMS = "SMS",
    WEBHOOK = "WEBHOOK",
    IN_APP = "IN_APP",
}

export enum NotificationPriority {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
}

export enum NotificationStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SENT = "SENT",
    FAILED = "FAILED",
    DROPPED = "DROPPED",
}
