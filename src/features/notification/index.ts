// The strict public API interface smoothly securely.
export { sendNotification, scheduleNotification, sendUserNotification } from "./api/sendNotification";
export { notificationService, NotificationService } from "./services/NotificationService";
export { NotificationChannel, NotificationPriority, NotificationStatus } from "./domain/enums";
export type { NotificationMessage } from "./domain/models";
export type { NotificationPayload, NotificationResult } from "./types";
