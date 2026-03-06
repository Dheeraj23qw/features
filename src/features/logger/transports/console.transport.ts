import { LogEntry } from "../domain/log-entry";
import { BaseTransport, TransportOptions } from "./transport.interface";

export interface ConsoleTransportOptions extends TransportOptions {
  useColors?: boolean;
  prefix?: string;
}

const COLOR_CODES = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[36m",
  GREEN: "\x1b[32m",
  MAGENTA: "\x1b[35m",
  GRAY: "\x1b[90m",
};

const LEVEL_COLORS: Record<string, string> = {
  TRACE: COLOR_CODES.GRAY,
  DEBUG: COLOR_CODES.BLUE,
  INFO: COLOR_CODES.GREEN,
  WARN: COLOR_CODES.YELLOW,
  ERROR: COLOR_CODES.RED,
  FATAL: COLOR_CODES.MAGENTA,
};

export class ConsoleTransport extends BaseTransport {
  readonly name = "console";
  private useColors: boolean;
  private prefix: string;

  constructor(options: ConsoleTransportOptions = {}) {
    super(options);
    this.useColors = options.useColors ?? true;
    this.prefix = options.prefix ?? "";
  }

  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.levelValue)) {
      return;
    }

    const formatted = this.formatEntry(entry);
    
    if (entry.levelValue >= 4) {
      console.error(formatted);
    } else if (entry.levelValue === 3) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  private formatEntry(entry: LogEntry): string {
    const parts: string[] = [];

    if (this.prefix) {
      parts.push(this.prefix);
    }

    const timestamp = entry.timestamp;
    parts.push(`[${timestamp}]`);

    const level = entry.level.toUpperCase().padEnd(5);
    if (this.useColors && LEVEL_COLORS[entry.level]) {
      parts.push(`${LEVEL_COLORS[entry.level]}${level}${COLOR_CODES.RESET}`);
    } else {
      parts.push(level);
    }

    parts.push(`[${entry.service}]`);

    if (entry.context.requestId) {
      parts.push(`[${entry.context.requestId}]`);
    }

    parts.push(entry.message);

    if (Object.keys(entry.metadata).length > 0) {
      parts.push(JSON.stringify(entry.metadata));
    }

    if (entry.error) {
      parts.push(`\n${entry.error.stack || entry.error.message}`);
    }

    return parts.join(" ");
  }
}
