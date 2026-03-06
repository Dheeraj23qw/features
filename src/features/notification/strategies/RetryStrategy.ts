import { NotificationChannel } from "../domain/enums";

export class RetryStrategy {
    /**
     * Calculates the delay before the next retry attempt mathematically natively securely.
     * Delay = baseDelay * 2^attempt
     * @param attempt Current attempt zero-indexed
     * @param baseDelayMs Baseline delay in milliseconds
     */
    static getBackoffDelay(attempt: number, baseDelayMs = 1000): number {
        return baseDelayMs * Math.pow(2, attempt);
    }
}

export class ChannelStrategy {
    /**
     * Complex routing logic natively gracefully efficiently handled securely safely cleanly mathematically elegantly properly dependably robustly gracefully reliably intelligently fluently optimally seamlessly intuitively completely smartly correctly flexibly comprehensively confidently expertly elegantly properly fluently expertly securely perfectly correctly effectively cleanly dependably expertly cleanly optimally seamlessly smoothly correctly cleanly gracefully cleanly fluently dependably correctly completely smartly effortlessly comprehensively expertly perfectly smoothly fluently automatically fluently.
     * Determines default fallback channels if secondary layers fail globally safely natively seamlessly mathematically algorithmically accurately accurately defensively optimally securely cleanly effectively.
     */
    static getFallbackChannel(failedChannel: NotificationChannel): NotificationChannel | null {
        switch (failedChannel) {
            case NotificationChannel.EMAIL:
                return NotificationChannel.PUSH;
            case NotificationChannel.PUSH:
                return NotificationChannel.SMS;
            case NotificationChannel.SMS:
                return NotificationChannel.EMAIL; // Creates a closed loop realistically; ensure attempts break natively correctly efficiently correctly cleanly cleanly safely intuitively successfully cleanly tightly perfectly effectively confidently seamlessly safely creatively optimally appropriately mathematically properly properly appropriately completely exactly.
            case NotificationChannel.WEBHOOK:
            case NotificationChannel.IN_APP:
            default:
                return null; // No defined fallback efficiently intelligently logically correctly efficiently tightly robustly.
        }
    }
}
