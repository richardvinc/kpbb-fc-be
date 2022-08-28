import { ILogger } from "@kopeka/types/Logger";

import { getCurrentHub } from "../hub";

export abstract class BaseProvider {
  protected logger: ILogger;

  constructor(protected name: string = "BaseProvider") {
    this.logger = getCurrentHub().getLogger(name);
  }
}
