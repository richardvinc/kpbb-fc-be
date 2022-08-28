import pino, { Bindings, Logger } from "pino";

import { ILogger } from "@kopeka/types";

interface PinoLoggerOptions {
  name: string;
  level: string;
  pretty?: boolean;
  bindings?: Bindings;
}

export class PinoLogger implements ILogger {
  private logger: Logger;

  constructor(private options: PinoLoggerOptions) {
    this.logger = pino({
      name: this.options.name,
      level: this.options.level,
      base: {
        ...options.bindings,
        pid: process.pid,
      },
      prettyPrint: options.pretty
        ? {
            translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
            ignore: "pid,method,traceId",
            messageFormat: "[{method}]({traceId}): {msg}",
          }
        : false,
    });
  }

  child(bindings: Bindings): PinoLogger {
    return new PinoLogger(Object.assign(this.options, { bindings }));
  }

  trace(msg: string): void;
  trace<T extends object>(obj: T, msg?: string): void {
    this.logFn("trace", obj, msg);
  }

  debug(msg: string): void;
  debug<T extends object>(obj: T, msg?: string): void {
    this.logFn("debug", obj, msg);
  }

  info(msg: string): void;
  info<T extends object>(obj: T, msg?: string): void {
    this.logFn("info", obj, msg);
  }

  warn(msg: string): void;
  warn<T extends object>(obj: T, msg?: string): void {
    this.logFn("warn", obj, msg);
  }

  fatal(msg: string): void;
  fatal<T extends object>(obj: T, msg?: string): void {
    this.logFn("fatal", obj, msg);
  }

  private logFn<T extends object>(method: string, obj: T, msg?: string): void {
    if (obj) {
      this.logger[method](obj, msg);
    } else if (msg) {
      this.logger[method](msg);
    }
  }
}
