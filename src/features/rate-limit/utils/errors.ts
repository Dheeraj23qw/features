export class RateLimitExceededError extends Error {
    public remaining: number;
    public resetTime: number;

    constructor(message: string, remaining: number, resetTime: number) {
        super(message);
        this.name = "RateLimitExceededError";
        this.remaining = remaining;
        this.resetTime = resetTime;
    }
}
