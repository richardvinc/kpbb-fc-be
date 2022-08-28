export interface ILogger {
  child(bindings: Bindings): ILogger;

  trace(msg: string): void;
  trace<T extends object>(obj?: T, msg?: string): void;

  debug(msg: string): void;
  debug<T extends object>(obj?: T, msg?: string): void;

  info(msg: string): void;
  info<T extends object>(obj?: T, msg?: string): void;

  warn(msg: string): void;
  warn<T extends object>(obj?: T, msg?: string): void;

  fatal(msg: string): void;
  fatal<T extends object>(obj?: T, msg?: string): void;
}

export interface Bindings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ILoggerCollection<ILogger> {
  [key: string]: ILogger;
}

export interface ILoggerManager {
  setLogLevel(level: string): void;
  getLogger(name: string): ILogger;
}

export type LogLevel = "trace" | "debug" | "info" | "warn" | "fatal";
