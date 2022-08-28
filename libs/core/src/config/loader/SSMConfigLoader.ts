import { IConfigLoader } from "./IConfigLoader";
import {
  GetParametersByPathCommand,
  GetParametersByPathCommandOutput,
  SSMClient,
  SSMClientConfig,
} from "@aws-sdk/client-ssm";

export interface SSMConfigLoaderOptions {
  path: string;
  clientOptions: SSMClientConfig;
}

export class SSMConfigLoader implements IConfigLoader {
  private MAX_PARAMS_RESULT = 10;
  private ssm: SSMClient;

  constructor(private options: SSMConfigLoaderOptions) {
    this.ssm = new SSMClient(options.clientOptions);
  }

  /**
   *
   */
  async resolveConfig(): Promise<void> {
    let first = true;
    let nextToken: string | undefined;

    while (first || nextToken !== undefined) {
      const response = await this.getSSMParameters(
        this.options.path,
        nextToken
      );
      if (response.Parameters) {
        // export params to process.env
        response.Parameters.map((param) => {
          if (param.Name) {
            const name: string = param.Name.replace(
              this.options.path + "/",
              ""
            );
            process.env[name] = param.Value;
          }
        });
      }
      first = false;
      nextToken = response.NextToken;
    }
  }

  private async getSSMParameters(
    path: string,
    nextToken?: string
  ): Promise<GetParametersByPathCommandOutput> {
    const command = new GetParametersByPathCommand({
      MaxResults: this.MAX_PARAMS_RESULT,
      Path: path,
      WithDecryption: true,
      NextToken: nextToken,
    });

    const response = await this.ssm.send(command);
    return response;
  }
}
