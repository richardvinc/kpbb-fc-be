import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";

import { UserCarErrors } from "../../errors";
import { JSONUserCarSerializer } from "../../serializers";
import { IUserCarService } from "../../services";
import {
  RetrieveUserCarListCommand,
  RetrieveUserCarListCommandSchema,
  RetrieveUserCarListDTO,
  RetrieveUserCarListPayload,
} from "./Command";

interface Cradle {
  userCarService: IUserCarService;
}

export type RetrieveUserCarListResponse = BaseResponse<
  UserCarErrors.UserCarNotFoundError,
  RetrieveUserCarListPayload
>;

export class RetrieveUserCarListUseCase extends UseCase<
  RetrieveUserCarListDTO,
  RetrieveUserCarListPayload,
  RetrieveUserCarListResponse
> {
  protected schema = RetrieveUserCarListCommandSchema;

  private userCarService: IUserCarService;

  constructor(cradle: Cradle) {
    super("RetrieveUserCarListUseCase");

    this.userCarService = cradle.userCarService;
  }

  async handler(
    req: RetrieveUserCarListCommand
  ): Promise<RetrieveUserCarListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { identity, dto } = req;

    try {
      const userCars = await this.userCarService.getAll({
        selection: {
          userIds: [new UniqueEntityId(identity.id)],
        },
      });

      if (userCars.length < 0)
        return left(new UserCarErrors.UserCarNotFoundError());

      logger.trace(`END`);
      return right(
        userCars.map((userCar) => JSONUserCarSerializer.serialize(userCar))
      );
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
