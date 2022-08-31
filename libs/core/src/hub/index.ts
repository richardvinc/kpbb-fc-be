import { AwilixContainer } from "awilix";
import { Namespace } from "cls-hooked";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

import {
  BaseApplicationService,
  IGlobalObject,
  IHub,
  ILogger,
  Registry,
} from "@KPBBFC/types";

import { DefaultCradle } from "./DefaultCradle";

export * from "./DefaultCradle";
export * from "./Factory";

export function getCurrentHub<
  T extends IHub<DefaultCradle, BaseApplicationService>
>(): T {
  const registry = getMainRegistry();

  if (registry.__KPBBFC__ && registry.__KPBBFC__.hub) {
    return registry.__KPBBFC__.hub as T;
  } else {
    throw new Error(`Hub is not available on registry`);
  }
}

export class Hub<
  TCradle extends DefaultCradle,
  TApplicationService extends BaseApplicationService
> implements IHub<TCradle, TApplicationService>
{
  private TRACE_ID_NAMESPACE = "__PTM_TRACE_ID__";
  private readonly container: AwilixContainer<TCradle & TApplicationService>;

  constructor(container: AwilixContainer<TCradle & TApplicationService>) {
    this.container = container;
  }

  public getApplicationService(): TApplicationService {
    return this.container.cradle;
  }

  public getCradle(): TCradle {
    return this.container.cradle;
  }

  public getLogger(name: string): ILogger {
    return this.container.cradle.loggerManager.getLogger(name);
  }

  public getTraceId(): string {
    return this.getNamespace().active
      ? this.getNamespace().get(this.TRACE_ID_NAMESPACE)
      : undefined;
  }

  public async dispose(): Promise<void> {
    await this.container.dispose();
  }

  public async runScope<T>(
    next: () => Promise<T>,
    traceId?: string
  ): Promise<T> {
    const ns = this.getNamespace();

    return ns.runPromise(async () => {
      ns.set(this.TRACE_ID_NAMESPACE, traceId || this.generateTraceId());
      return await next();
    });
  }

  private getNamespace(): Namespace {
    return this.container.cradle.namespace;
  }

  private generateTraceId(): string {
    const nanoid = customAlphabet(alphanumeric, 25);
    return nanoid();
  }
}

export function registerHub(
  hub: IHub<DefaultCradle, BaseApplicationService>
): void {
  const registry = getMainRegistry();
  registry.__KPBBFC__ = registry.__KPBBFC__ || {};
  registry.__KPBBFC__.hub = hub;
}

function getMainRegistry(): Registry {
  const registry = getGlobalObject();
  registry.__KPBBFC__ = registry.__KPBBFC__ || {
    hub: undefined,
  };
  return registry;
}

function getGlobalObject(): NodeJS.Global & IGlobalObject {
  return global as unknown as NodeJS.Global & IGlobalObject;
}
