export type LogLevel = "info" | "warn" | "error";

export interface LogPayload {
    message: string;
    email_id?: string;
    provider?: string;
    template?: string;
    status?: string;
    retry_count?: number;
    timestamp?: string;
    latency_ms?: number;
    [key: string]: any;
}

export class StructuredLogger {
    private format(level: LogLevel, payload: LogPayload): string {
        const log = {
            level,
            timestamp: new Date().toISOString(),
            ...payload
        };
        return JSON.stringify(log);
    }

    info(payload: LogPayload) {
        console.log(this.format("info", payload));
    }

    warn(payload: LogPayload) {
        console.warn(this.format("warn", payload));
    }

    error(payload: LogPayload) {
        console.error(this.format("error", payload));
    }
}

export const logger = new StructuredLogger();
