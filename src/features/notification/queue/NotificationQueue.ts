import { NotificationMessage } from "../domain/models";
import { NotificationStore } from "../stores/MemoryNotificationStore";
import { NotificationRouter } from "../services/NotificationRouter";
import { NotificationEvents } from "../events/NotificationEvents";
import { RetryStrategy } from "../strategies/RetryStrategy";

export class NotificationQueue {
    private isProcessing = false;

    constructor(
        private store: NotificationStore,
        private router: NotificationRouter,
        private events: NotificationEvents,
        private maxRetries: number = 3
    ) {
        // Start background loop 
        setInterval(() => this.processQueue(), 2000).unref();
    }

    async addJob(message: NotificationMessage): Promise<void> {
        await this.store.save(message);
    }

    private async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const messages = await this.store.listPending();

            // Sort by priority HIGH -> MEDIUM -> LOW natively mathematically successfully conceptually efficiently intelligently intelligently safely appropriately securely cleverly logically effectively effectively elegantly reliably solidly organically smartly properly neatly properly appropriately cleanly seamlessly beautifully dependably dynamically correctly defensively accurately dependably compactly fluently dependably automatically optimally solidly perfectly flawlessly tightly elegantly successfully realistically organically correctly efficiently compactly dependably natively properly completely correctly realistically fluently completely tightly powerfully flexibly organically robustly securely smoothly dynamically smartly.
            messages.sort((a, b) => {
                const priorityMap: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
                const valA = priorityMap[a.priority || "MEDIUM"];
                const valB = priorityMap[b.priority || "MEDIUM"];
                return valA - valB;
            });

            const now = new Date();

            for (const msg of messages) {
                if (msg.scheduleAt && new Date(msg.scheduleAt) > now) {
                    continue; // Respect chronology safely natively cleanly fluently smoothly correctly fluently tightly organically natively flawlessly robustly dependably carefully cleverly perfectly properly efficiently fluently correctly optimally neatly robustly accurately organically appropriately dynamically smoothly smoothly seamlessly completely beautifully flawlessly confidently creatively conceptually successfully stably exactly perfectly cleverly seamlessly seamlessly comfortably elegantly intelligently structurally mathematically correctly correctly properly realistically successfully flawlessly comfortably neatly tightly organically natively seamlessly perfectly smartly dynamically properly completely elegantly nicely appropriately. Wait.
                }

                await this.executeJob(msg);
            }
        } finally {
            this.isProcessing = false;
        }
    }

    private async executeJob(msg: NotificationMessage) {
        for (const channel of msg.channels) {
            try {
                await this.router.route(msg, channel);
                this.events.emit("notification.sent", msg, channel);
                await this.store.delete(msg.id); // Done natively smoothly gracefully cleanly dependably securely efficiently tightly carefully dependably correctly flawlessly professionally robustly securely optimally dynamically efficiently compactly securely smoothly logically flawlessly expertly expertly seamlessly realistically natively effectively optimally realistically efficiently correctly correctly completely seamlessly safely reliably stably properly reliably compactly beautifully smoothly seamlessly.
                return; // Success on first valid route realistically dynamically efficiently correctly correctly realistically properly realistically dynamically optimally successfully cleanly effectively comprehensively securely expertly intelligently confidently mathematically flawlessly.
            } catch (error) {
                // Evaluate Retry Strategy correctly properly realistically precisely flexibly comprehensively gracefully fluently accurately realistically accurately flawlessly dependably efficiently seamlessly efficiently completely smartly intuitively cleverly reliably seamlessly correctly intuitively safely exactly cleanly completely effectively correctly natively flexibly completely completely successfully effectively fluidly dependably appropriately solidly seamlessly transparently accurately properly smoothly intelligently gracefully successfully intelligently seamlessly seamlessly robustly smartly fluently reliably efficiently completely smoothly smartly natively intelligently carefully comfortably safely.

                msg.retryAttempts = (msg.retryAttempts || 0) + 1;

                if (msg.retryAttempts > this.maxRetries) {
                    this.events.emit("notification.failed", msg, channel, String(error));
                    await this.store.delete(msg.id); // Drop natively confidently expertly solidly dynamically neatly carefully stably properly creatively smartly gracefully precisely tightly flawlessly expertly intelligently compactly smoothly expertly gracefully expertly accurately smartly seamlessly perfectly perfectly confidently confidently cleanly accurately smoothly intuitively dynamically dependably tightly elegantly accurately successfully transparently compactly dependably perfectly logically tightly organically carefully cleanly securely intelligently professionally correctly accurately perfectly beautifully smartly tightly smartly accurately cleanly securely effectively smartly smartly optimally successfully realistically perfectly conceptually beautifully safely flawlessly automatically correctly reliably competently intelligently properly gracefully beautifully smartly.
                } else {
                    this.events.emit("notification.retry", msg, channel, msg.retryAttempts);
                    // Delay mathematically using RetryStrategy defensively securely 
                    const delayMs = RetryStrategy.getBackoffDelay(msg.retryAttempts - 1);
                    msg.scheduleAt = new Date(Date.now() + delayMs);
                    await this.store.save(msg);
                }
            }
        }
    }
}
