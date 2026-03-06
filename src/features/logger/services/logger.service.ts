import { randomUUID } from "crypto";
import { LogLevel, LogLevelName, DEFAULT_LOG_LEVEL, getLevelValue } from "../domain/log-level";
import { LogEntry, LogEntryInput, LogContext } from "../domain/log-entry";
import { LogTransport } from "../transports/transport.interface";

export interface LoggerOptions {
  service?: string;
  minLevel?: LogLevel | LogLevelName | number;
  transports?: LogTransport[];
  defaultContext?: LogContext;
}

export class Logger {
  private service: string;
  private minLevel: number;
  private transports: LogTransport[] = [];
  private defaultContext: LogContext = {};
  private childLoggers: Map<string, Logger> = new Map();

  constructor(options: LoggerOptions = {}) {
    this.service = options.service ?? "app";
    this.minLevel = typeof options.minLevel === "number" 
      ? options.minLevel 
      : getLevelValue(options.minLevel ?? DEFAULT_LOG_LEVEL);
    
    if (options.transports) {
      this.transports = options.transports;
    }

    if (options.defaultContext) {
      this.defaultContext = options.defaultContext;
    }
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  setMinLevel(level: LogLevel | LogLevelName | number): void {
    this.minLevel = typeof level === "number" ? level : getLevelValue(level);
    
    for (const transport of this.transports) {
      if ("setMinLevel" in transport) {
        (transport as { setMinLevel: (l: number) => void }).setMinLevel(this.minLevel);
      }
    }
  }

  child(service: string): Logger {
    if (!this.childLoggers.has(service)) {
      const child = new Logger({
        service: `${this.service}:${service}`,
        minLevel: this.minLevel,
        transports: this.transports,
        defaultContext: this.defaultContext,
      });
      this.childLoggers.set(service, child);
    }
    return this.childLoggers.get(service)!;
  }

  setContext(context: Partial<LogContext>): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  clearContext(): void {
    this.defaultContext = {};
  }

  trace(message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: LogLevel.TRACE, message, metadata });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: LogLevel.DEBUG, message, metadata });
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: LogLevel.INFO, message, metadata });
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: LogLevel.WARN, message, metadata });
  }

  error(message: string, metadata?: Record<string, unknown>, error?: Error): void {
    this.log({ level: LogLevel.ERROR, message, metadata, error });
  }

  fatal(message: string, metadata?: Record<string, unknown>, error?: Error): void {
    this.log({ level: LogLevel.FATAL, message, metadata, error });
  }

  private log(input: LogEntryInput): void {
    const context: LogContext = {
      ...this.defaultContext,
      ...input.context,
    };

    if (!context.requestId) {
      context.requestId = randomUUID();
    }

    const entry = createLogEntry(
      {
        ...input,
        service: this.service,
        context,
      },
      this.service
    );

    if (entry.levelValue < this.minLevel) {
      return;
    }

    for (const transport of this.transports) {
      try {
        transport.log(entry);
      } catch (error) {
        console.error(`Transport ${transport.name} failed:`, error);
      }
    }
  }

  async flush(): Promise<void> {
    for (const transport of this.transports) {
      if (transport.flush) {
        await transport.flush();
      }
    }
  }

  async close(): Promise<void> {
    await this.flush();
    
    for (const transport of this.transports) {
      if (transport.close) {
        await transport.close();
      }
    }
  }
}

function createLogEntry(
  input: LogEntryInput,
  defaultService: string
): LogEntry {
  const levelName = typeof input.level === "string" 
    ? input.level 
    : (["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as const)[input.level ?? 2];
  
  const levelValue = typeof input.level === "number" 
    ? input.level 
    : (["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"].indexOf(levelName));

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: levelName,
    levelValue,
    message: input.message,
    service: input.service || defaultService,
    context: input.context || {},
    metadata: input.metadata || {},
  };

  if (input.error) {
    entry.error = {
      name: input.error.name,
      message: input.error.message,
      stack: input.error.stack,
    };
  }

  return entry;
}
