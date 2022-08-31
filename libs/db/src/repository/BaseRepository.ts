import { getCurrentHub } from "@KPBBFC/core/hub";
import { ILogger } from "@KPBBFC/types/Logger";

export enum OrderDirection {
  ASC,
  DESC,
}

export abstract class BaseRepository {
  protected logger: ILogger;

  constructor(name: string) {
    this.logger = getCurrentHub().getLogger(name);
  }
}
