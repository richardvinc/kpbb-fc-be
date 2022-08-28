import { IConfigLoader } from "./IConfigLoader";

export class NoopConfigLoader implements IConfigLoader {
  async resolveConfig(): Promise<void> {
    return;
  }
}
