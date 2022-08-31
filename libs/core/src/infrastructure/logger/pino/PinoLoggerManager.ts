import { ILoggerCollection, ILoggerManager, LogLevel } from "@KPBBFC/types";

import { PinoLogger } from "./PinoLogger";

export class PinoLoggerManager implements ILoggerManager {
  private logLevel: LogLevel;
  private loggers: ILoggerCollection<PinoLogger> = {};

  constructor(level: LogLevel = "debug") {
    this.logLevel = level;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public getLogger(name: string): PinoLogger {
    let logger: PinoLogger;

    if (!this.loggers[name]) {
      logger = new PinoLogger({
        name,
        level: this.logLevel,
        pretty: !!process.env.IS_LOCAL || !!process.env.IS_OFFLINE || false,
      });
      this.loggers[name] = logger;
    } else {
      logger = this.loggers[name];
    }

    return logger;
  }
}
