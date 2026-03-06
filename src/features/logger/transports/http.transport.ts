import { LogEntry } from "../domain/log-entry";
import { BaseTransport, TransportOptions } from "./transport.interface";

export interface HttpTransportOptions extends TransportOptions {
  url: string;
  method?: "POST" | "PUT";
  headers?: Record<string, string>;
  batchSize?: number;
  batchInterval?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class HttpTransport extends BaseTransport {
  readonly name = "http";
  private url: string;
  private method: "POST" | "PUT";
  private headers: Record<string, string>;
  private batchSize: number;
  private batchInterval: number;
  private retryAttempts: number;
  private retryDelay: number;
  private buffer: LogEntry[] = [];
  private flushInterval?: NodeJS.Timeout;

  constructor(options: HttpTransportOptions) {
    super(options);
    this.url = options.url;
    this.method = options.method ?? "POST";
    this.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    this.batchSize = options.batchSize ?? 10;
    this.batchInterval = options.batchInterval ?? 5000;
    this.retryAttempts = options.retryAttempts ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;

    if (this.batchInterval > 0) {
      this.flushInterval = setInterval(() => {
        this.flush().catch(console.error);
      }, this.batchInterval);
    }
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.shouldLog(entry.levelValue)) {
      return;
    }

    this.buffer.push(entry);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const entries = this.buffer.splice(0);
    
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(this.url, {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify({ logs: entries }),
        });

        if (response.ok) {
          return;
        }

        if (response.status >= 500 && attempt < this.retryAttempts - 1) {
          await this.delay(this.retryDelay * (attempt + 1));
          continue;
        }

        break;
      } catch (error) {
        if (attempt < this.retryAttempts - 1) {
          await this.delay(this.retryDelay * (attempt + 1));
          continue;
        }
        console.error("Failed to send logs to HTTP endpoint:", error);
      }
    }
  }

  async close(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
