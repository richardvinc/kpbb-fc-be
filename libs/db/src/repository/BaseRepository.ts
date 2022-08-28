import { getCurrentHub } from "@kopeka/core/hub";
import { ILogger } from "@kopeka/types/Logger";

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
