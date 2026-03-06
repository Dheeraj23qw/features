import { EmailMessage, EmailResult } from "../domain/models";
import { providerRegistry } from "../services/providers/registry";
import { logger } from "../logger";
import { emailEvents } from "../events";

export interface QueueJob {
    id: string;
    message: EmailMessage;
    attempts: number;
    priority: number;
    sendAt?: Date;
}

export interface QueueAdapter {
    process(message: EmailMessage): Promise<EmailResult>;
}

export class MemoryQueue implements QueueAdapter {
    private MAX_RETRIES = 3;
    private BASE_DELAY_MS = 1000;

    private tokens = 10;
    private maxTokens = 10;
    private readonly REFILL_RATE_MS = 1000;

    private idempotencyCache: Set<string> = new Set();
    private pendingJobs: QueueJob[] = [];
    private isProcessingLoopActive = false;

    constructor() {
        setInterval(() => {
            this.tokens = Math.min(this.tokens + 10, this.maxTokens);
        }, this.REFILL_RATE_MS);

        setInterval(() => this.processPendingJobs(), 1000);
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private waitForToken(): Promise<void> {
        if (this.tokens > 0) {
            this.tokens--;
            return Promise.resolve();
        }
        return new Promise(resolve => {
            const wait = setInterval(() => {
                if (this.tokens > 0) {
                    this.tokens--;
                    clearInterval(wait);
                    resolve();
                }
            }, 100);
        });
    }

    async process(message: EmailMessage): Promise<EmailResult> {
        const idempKey = message.metadata?.idempotencyKey;
        if (idempKey) {
            if (this.idempotencyCache.has(idempKey)) {
                logger.info({ message: "Idempotency Hit. Skipping.", email_id: idempKey });
                return { success: true, messageId: `idemp-${idempKey}` };
            }
            this.idempotencyCache.add(idempKey);
        }

        const priorityMap = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        const priority = message.metadata?.priority ? priorityMap[message.metadata.priority] : 1;

        if (message.sendAt) {
            this.pendingJobs.push({
                id: idempKey || Date.now().toString(),
                message,
                attempts: 0,
                priority,
                sendAt: message.sendAt,
            });
            logger.info({ message: "Job scheduled", timestamp: message.sendAt.toISOString() });
            return { success: true, messageId: "scheduled" };
        }

        return this.executeJobWithRetries(message);
    }

    private async processPendingJobs() {
        if (this.isProcessingLoopActive || this.pendingJobs.length === 0) return;
        this.isProcessingLoopActive = true;

        const now = new Date();

        this.pendingJobs.sort((a, b) => a.priority - b.priority);

        const readyIndexes: number[] = [];
        for (let i = 0; i < this.pendingJobs.length; i++) {
            if (!this.pendingJobs[i].sendAt || this.pendingJobs[i].sendAt! <= now) {
                readyIndexes.push(i);
            }
        }

        if (readyIndexes.length > 0) {
            const index = readyIndexes[0];
            const job = this.pendingJobs.splice(index, 1)[0];
            this.executeJobWithRetries(job.message).catch(e => logger.error({ message: "Background processing failed", error: e.message }));
        }

        this.isProcessingLoopActive = false;
    }

    private async executeJobWithRetries(message: EmailMessage): Promise<EmailResult> {
        let attempts = 0;
        let currentProviderName = providerRegistry.getPrimaryProvider().name;
        const startTime = Date.now();

        while (attempts <= this.MAX_RETRIES) {
            attempts++;
            await this.waitForToken();

            const activeProvider = providerRegistry.getProvider(currentProviderName);
            if (!activeProvider) return { success: false, error: `Provider ${currentProviderName} not found.` };

            try {
                logger.info({ message: "Attempting to send", provider: activeProvider.name, attempt: attempts });

                const result = await activeProvider.send(message);
                const latency_ms = Date.now() - startTime;

                if (result.success) {
                    logger.info({ message: "Email Sent Successfully", provider: activeProvider.name, latency_ms });
                    emailEvents.emitEvent("email.sent", { message, result, provider: activeProvider.name });
                    return result;
                }

                if (result.retryable === false) throw new Error(result.error);
                throw new Error(result.error || "Unknown provider error");
            } catch (error: any) {
                logger.warn({ message: "Provider Failed", provider: activeProvider.name, error: error.message, retry_count: attempts });
                emailEvents.emitEvent("email.retry", { message, error, provider: activeProvider.name, attempt: attempts });

                const nextProvider = providerRegistry.getNextFallback(activeProvider.name);
                if (nextProvider) {
                    logger.info({ message: "Switching to fallback provider", nextProvider: nextProvider.name });
                    currentProviderName = nextProvider.name;
                }

                if (attempts > this.MAX_RETRIES) {
                    logger.error({ message: "Max retries reached", error: error.message });
                    emailEvents.emitEvent("email.failed", { message, error });
                    return { success: false, error: `Max retries reached: ${error.message}` };
                }

                const backoffDelay = this.BASE_DELAY_MS * Math.pow(2, attempts - 1);
                await this.delay(backoffDelay);
            }
        }
        return { success: false, error: "Unexpected queue failure" };
    }
}
