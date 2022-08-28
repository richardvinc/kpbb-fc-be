import { ObjectSchema } from "joi";

import { ICommand, ILogger, IUseCase } from "@kopeka/types";

import { BaseError, InternalError, RequestError } from "../errors";
import { getCurrentHub } from "../hub";
import { Either, Guard, left } from "../logic";

export type BaseResponse<TError, TOutput> = Either<
  InternalError.UnexpectedError | RequestError.InvalidArgumentError | TError,
  TOutput
>;
export abstract class UseCase<
  IDTO extends object,
  TResult,
  TResponse extends Either<BaseError, TResult>
> implements IUseCase<IDTO, TResponse>
{
  protected logger: ILogger;
  protected abstract schema: ObjectSchema<ICommand<IDTO>>;

  constructor(private name: string) {
    this.logger = getCurrentHub().getLogger(name);
  }

  async execute(command: ICommand<Partial<IDTO>>): Promise<TResponse> {
    const logger = this.logger.child({
      method: "execute",
      traceId: getCurrentHub().getTraceId(),
    });
    const guardResult = Guard.against<ICommand<IDTO>>(this.schema, command);
    if (!guardResult.succeeded) {
      return left(
        new RequestError.InvalidArgumentError(guardResult.message)
      ) as TResponse;
    } else {
      try {
        logger.info({ [`${this.name}Command`]: command });
        const response = await this.handler(guardResult.value);
        logger.info({ [`${this.name}Response`]: response });
        return response;
      } catch (err) {
        return left(
          new InternalError.UnexpectedError(err, "UseCaseException")
        ) as TResponse;
      }
    }
  }

  abstract handler(command: ICommand<IDTO>): Promise<TResponse>;
}
