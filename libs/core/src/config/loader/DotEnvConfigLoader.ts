import dotenv from "dotenv";
import path from "path";
import { IConfigLoader } from "./IConfigLoader";

export class DotEnvConfigLoader implements IConfigLoader {
  async resolveConfig(): Promise<void> {
    dotenv.config({
      path: path.resolve(process.cwd(), ".env.local"),
    });
  }
}
