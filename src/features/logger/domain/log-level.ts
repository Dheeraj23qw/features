export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

export const LOG_LEVEL_NAMES = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as const;

export type LogLevelName = (typeof LOG_LEVEL_NAMES)[number];

export function getLevelName(level: LogLevel): LogLevelName {
  return LOG_LEVEL_NAMES[level] as LogLevelName;
}

export function getLevelValue(name: string): LogLevel {
  const index = LOG_LEVEL_NAMES.indexOf(name as LogLevelName);
  return index >= 0 ? index : LogLevel.INFO;
}

export const LEVEL_PRIORITY: Record<LogLevelName, number> = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

export const DEFAULT_LOG_LEVEL = LogLevel.INFO;
