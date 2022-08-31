import {
  asFunction,
  asValue,
  createContainer,
  NameAndRegistrationPair,
} from "awilix";
import { createNamespace } from "cls-hooked";

import { BaseApplicationService, LogLevel } from "@KPBBFC/types";

import {
  DotEnvConfigLoader,
  NoopConfigLoader,
  SSMConfigLoader,
} from "../config/loader";
import { IConfigLoader } from "../config/loader/IConfigLoader";
import { PinoLoggerManager } from "../infrastructure/logger/pino";
import { Hub, registerHub } from "./";
import { DefaultCradle } from "./DefaultCradle";

export type ConfigSourceOptions =
  | SSMConfigSourceOptions
  | DotEnvConfigSourceOptions;

type SSMConfigSourceOptions = {
  provider: "ssm";
  path: string;
  fallbackRegion?: string;
};

type DotEnvConfigSourceOptions = {
  provider: "dotenv";
};

export interface HubOptions<TCradle, TApplicationService> {
  configSource?: ConfigSourceOptions;
  cradle: NameAndRegistrationPair<TCradle>;
  useCases: NameAndRegistrationPair<TApplicationService>;
}

export async function initHub<
  TCradle extends DefaultCradle,
  TApplicationService extends BaseApplicationService
>(options: HubOptions<TCradle, TApplicationService>): Promise<void> {
  await loadConfig(options.configSource);

  const container = createContainer<TCradle & TApplicationService>();

  container.register({
    awsRegion: asValue(process.env.DEFAULT_AWS_REGION || "ap-southeast-1"),
    namespace: asValue(createNamespace("__KPBBFC__")),
    loggerManager: usePinoLoggerManager(),
    stage: asValue(process.env.STAGE || "dev"),
    ...options.cradle,
    ...options.useCases,
  } as NameAndRegistrationPair<TCradle & TApplicationService>);

  registerHub(new Hub<TCradle, TApplicationService>(container));
}

async function loadConfig(options?: ConfigSourceOptions): Promise<void> {
  let loader: IConfigLoader;

  if (!options) {
    loader = new NoopConfigLoader();
  } else {
    if (options.provider === "ssm") {
      loader = new SSMConfigLoader({
        path: options.path,
        clientOptions: {
          region:
            process.env.SSM_REGION ||
            process.env.DEFAULT_AWS_REGION ||
            options.fallbackRegion ||
            "ap-southeast-1",
        },
      });
    } else {
      loader = new DotEnvConfigLoader();
    }
  }

  await loader.resolveConfig();
}

function usePinoLoggerManager() {
  return asFunction(() => {
    const logLevel: LogLevel = process.env.LOG_LEVEL
      ? (process.env.LOG_LEVEL as LogLevel)
      : "debug";
    return new PinoLoggerManager(logLevel);
  }).singleton();
}
