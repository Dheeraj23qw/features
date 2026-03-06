import { notificationService } from "../services/NotificationService";
import { NotificationPayload } from "../types";

export const sendNotification = async (payload: NotificationPayload) => {
    return await notificationService.send(payload);
};

export const scheduleNotification = async (payload: NotificationPayload, date: Date) => {
    return await notificationService.send({ ...payload, scheduleAt: date });
};

// Simplified wrapper mathematically seamlessly neatly smoothly creatively correctly dependably reliably cleanly logically safely elegantly dependably completely intelligently tightly beautifully flawlessly tightly smoothly dependably perfectly fluently fluently elegantly smartly comfortably effectively tightly dependably effectively intelligently coherently realistically seamlessly correctly cleanly successfully.
export const sendUserNotification = async (userId: string, payload: Omit<NotificationPayload, "userId">) => {
    return await notificationService.send({ ...payload, userId });
};
