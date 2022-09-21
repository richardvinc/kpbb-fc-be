import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";

import { UserCarErrors, UserErrors } from "../../errors";
import { JSONUserFuelConsumptionSummarySerializer } from "../../serializers";
import {
  IUserCarService,
  IUserFuelConsumptionSummaryService,
} from "../../services";
import { IUserService } from "../../services/IUserService";
import {
  RetrieveUserFuelConsumptionSummaryListCommand,
  RetrieveUserFuelConsumptionSummaryListCommandSchema,
  RetrieveUserFuelConsumptionSummaryListDTO,
  RetrieveUserFuelConsumptionSummaryListPayload,
} from "./Command";

interface Cradle {
  userService: IUserService;
  userCarService: IUserCarService;
  userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;
}

export type RetrieveUserFuelConsumptionSummaryListResponse = BaseResponse<
  UserErrors.UserNotFoundError | UserCarErrors.UserCarNotFoundError,
  RetrieveUserFuelConsumptionSummaryListPayload
>;

export class RetrieveUserFuelConsumptionSummaryListUseCase extends UseCase<
  RetrieveUserFuelConsumptionSummaryListDTO,
  RetrieveUserFuelConsumptionSummaryListPayload,
  RetrieveUserFuelConsumptionSummaryListResponse
> {
  protected schema = RetrieveUserFuelConsumptionSummaryListCommandSchema;

  private userService: IUserService;
  private userCarService: IUserCarService;
  private userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;

  constructor(cradle: Cradle) {
    super("RetrieveUserFuelConsumptionSummaryListUseCase");

    this.userService = cradle.userService;
    this.userCarService = cradle.userCarService;
    this.userFuelConsumptionSummaryService =
      cradle.userFuelConsumptionSummaryService;
  }

  async handler(
    req: RetrieveUserFuelConsumptionSummaryListCommand
  ): Promise<RetrieveUserFuelConsumptionSummaryListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { identity, dto } = req;

    try {
      const user = await this.userService.get({
        selection: {
          id: identity.id,
        },
      });
      if (!user) return left(new UserErrors.UserNotFoundError());

      if (dto.carId) {
        const userCar = await this.userCarService.get({
          selection: {
            id: new UniqueEntityId(dto.carId),
          },
        });
        if (!userCar) return left(new UserCarErrors.UserCarNotFoundError());
      }

      const summaries = await this.userFuelConsumptionSummaryService.getAll({
        selection: {
          userIds: [user.id],
          userCarIds: dto.carId ? [new UniqueEntityId(dto.carId)] : undefined,
        },
      });

      for (const s of summaries) {
        s.setUser(user);
      }

      const response = summaries.map((s) =>
        JSONUserFuelConsumptionSummarySerializer.serialize(s)
      );

      return right(response);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
