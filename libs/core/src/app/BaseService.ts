import { ILogger } from "@KPBBFC/types";

import { getCurrentHub } from "../hub";

export abstract class BaseService {
  protected logger: ILogger;

  constructor(name: string) {
    this.logger = getCurrentHub().getLogger(name);
  }
}
