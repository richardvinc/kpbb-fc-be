export interface IConfigLoader {
  resolveConfig(): Promise<void>;
}
