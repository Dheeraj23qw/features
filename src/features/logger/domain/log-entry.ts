import { LogLevel, LogLevelName } from "./log-level";

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevelName;
  levelValue: number;
  message: string;
  service: string;
  context: LogContext;
  metadata: LogMetadata;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LogEntryInput {
  level?: LogLevel | LogLevelName;
  message: string;
  service?: string;
  context?: LogContext;
  metadata?: LogMetadata;
  error?: Error;
}

export function createLogEntry(
  input: LogEntryInput,
  defaultService: string = "app"
): LogEntry {
  const levelName = typeof input.level === "string" 
    ? input.level 
    : getLevelName(input.level ?? LogLevel.INFO);
  
  const levelValue = typeof input.level === "number" 
    ? input.level 
    : getLevelValue(levelName);

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

function getLevelName(level: LogLevel): LogLevelName {
  const names = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as const;
  return names[level] ?? "INFO";
}

function getLevelValue(name: string): number {
  const levels: Record<string, number> = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
  };
  return levels[name] ?? 2;
}
