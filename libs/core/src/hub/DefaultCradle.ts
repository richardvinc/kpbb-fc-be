import { Namespace } from "cls-hooked";

import { BaseCradle, ILoggerManager, Stage } from "@kopeka/types";

export interface DefaultCradle extends BaseCradle {
  awsRegion: string;
  namespace: Namespace;
  loggerManager: ILoggerManager;
  stage: Stage;
}
