import { LogEntry } from "../domain/log-entry";

export interface LogTransport {
  readonly name: string;
  log(entry: LogEntry): void | Promise<void>;
  flush?(): Promise<void>;
  close?(): Promise<void>;
}

export interface TransportOptions {
  minLevel?: number;
  enabled?: boolean;
}

export abstract class BaseTransport implements LogTransport {
  abstract readonly name: string;
  protected minLevel: number = 0;
  protected enabled: boolean = true;

  constructor(options: TransportOptions = {}) {
    this.minLevel = options.minLevel ?? 0;
    this.enabled = options.enabled ?? true;
  }

  abstract log(entry: LogEntry): void | Promise<void>;

  shouldLog(levelValue: number): boolean {
    return this.enabled && levelValue >= this.minLevel;
  }

  setMinLevel(level: number): void {
    this.minLevel = level;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
