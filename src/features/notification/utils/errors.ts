export class NotificationError extends Error {
    public channelFallbackInitiated: boolean;

    constructor(message: string, channelFallbackInitiated = false) {
        super(message);
        this.name = "NotificationError";
        this.channelFallbackInitiated = channelFallbackInitiated;
    }
}
