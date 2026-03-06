import { LogEntry } from "../domain/log-entry";
import { BaseTransport, TransportOptions } from "./transport.interface";

export interface FileTransportOptions extends TransportOptions {
  directory?: string;
  filename?: string;
  maxSize?: number;
  maxFiles?: number;
  rotateDaily?: boolean;
}

export class FileTransport extends BaseTransport {
  readonly name = "file";
  private directory: string;
  private filename: string;
  private maxSize: number;
  private maxFiles: number;
  private rotateDaily: boolean;
  private currentDate: string = "";
  private buffer: string[] = [];
  private flushInterval?: NodeJS.Timeout;

  constructor(options: FileTransportOptions = {}) {
    super(options);
    this.directory = options.directory ?? "./logs";
    this.filename = options.filename ?? "app.log";
    this.maxSize = options.maxSize ?? 10 * 1024 * 1024;
    this.maxFiles = options.maxFiles ?? 7;
    this.rotateDaily = options.rotateDaily ?? false;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.shouldLog(entry.levelValue)) {
      return;
    }

    const line = JSON.stringify(entry) + "\n";
    this.buffer.push(line);
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const lines = this.buffer.splice(0);
    const content = lines.join("");

    try {
      const fs = await import("fs/promises");
      await fs.mkdir(this.directory, { recursive: true });
      
      const filepath = this.getFilepath();
      await fs.appendFile(filepath, content);
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  async close(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }

  private getFilepath(): string {
    const date = new Date().toISOString().split("T")[0];
    
    if (this.rotateDaily && date !== this.currentDate) {
      this.currentDate = date;
    }

    const name = this.rotateDaily 
      ? this.filename.replace(".log", `-${this.currentDate}.log`)
      : this.filename;

    return `${this.directory}/${name}`;
  }
}
