import { ILogger } from "./Logger";

export type BaseCradle = {};
export type BaseApplicationService = {};

export interface IHub<
  TCradle extends BaseCradle,
  TApplicationService extends BaseApplicationService
> {
  dispose(): Promise<void>;
  getApplicationService(): TApplicationService;
  getCradle(): TCradle;
  getTraceId(): string;
  getLogger(name: string): ILogger;
  runScope<T>(next: () => Promise<T>, traceId?: string): Promise<T>;
}

export interface Registry {
  __KPBBFC__?: {
    hub?: IHub<{}, {}>;
  };
}

export interface IGlobalObject {
  __KPBBFC__: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hub: any;
  };
}
