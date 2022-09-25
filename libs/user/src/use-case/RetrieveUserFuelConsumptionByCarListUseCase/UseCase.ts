import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";

import { UserFuelConsumptionHistory } from "../../domains";
import { UserCarErrors, UserErrors } from "../../errors";
import {
  GetAllUserFuelConsumptionSelection,
  UserFuelConsumptionOrderFields,
} from "../../repositories";
import { JSONUserFuelConsumptionHistorySerializer } from "../../serializers";
import { IUserCarService, IUserFuelConsumptionService } from "../../services";
import { IUserService } from "../../services/IUserService";
import {
  RetrieveUserFuelConsumptionListByCarCommand,
  RetrieveUserFuelConsumptionListByCarCommandSchema,
  RetrieveUserFuelConsumptionListByCarDTO,
  RetrieveUserFuelConsumptionListByCarPayload,
} from "./Command";

interface Cradle {
  userService: IUserService;
  userCarService: IUserCarService;
  userFuelConsumptionService: IUserFuelConsumptionService;
}

export type RetrieveUserFuelConsumptionListByCarResponse = BaseResponse<
  UserErrors.UserNotFoundError | UserCarErrors.UserCarNotFoundError,
  RetrieveUserFuelConsumptionListByCarPayload
>;

export class RetrieveUserFuelConsumptionListByCarUseCase extends UseCase<
  RetrieveUserFuelConsumptionListByCarDTO,
  RetrieveUserFuelConsumptionListByCarPayload,
  RetrieveUserFuelConsumptionListByCarResponse
> {
  protected schema = RetrieveUserFuelConsumptionListByCarCommandSchema;

  private userService: IUserService;
  private userCarService: IUserCarService;
  private userFuelConsumptionService: IUserFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("RetrieveUserFuelConsumptionListByCarUseCase");

    this.userService = cradle.userService;
    this.userCarService = cradle.userCarService;
    this.userFuelConsumptionService = cradle.userFuelConsumptionService;
  }

  async handler(
    req: RetrieveUserFuelConsumptionListByCarCommand
  ): Promise<RetrieveUserFuelConsumptionListByCarResponse> {
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

      const userCar = await this.userCarService.get({
        selection: {
          id: new UniqueEntityId(dto.carId),
          userId: new UniqueEntityId(identity.id),
        },
      });
      if (!userCar) return left(new UserCarErrors.UserCarNotFoundError());

      const filter: GetAllUserFuelConsumptionSelection = {
        selection: {
          userIds: [new UniqueEntityId(identity.id)],
          userCarIds: [new UniqueEntityId(dto.carId)],
        },
        limit: dto.limit,
        page: dto.page,
        orderBy: [UserFuelConsumptionOrderFields.FILLED_AT, OrderDirection.ASC],
      };
      const fuelConsumptions = await this.userFuelConsumptionService.getAll(
        filter
      );
      const totalEntries = await this.userFuelConsumptionService.getCount(
        filter
      );

      const userFuelConsumptionHistory = UserFuelConsumptionHistory.create({
        user,
        car: userCar,
        fuelConsumptions: fuelConsumptions.map((ufc) => ufc.fuelConsumption),
      });

      return right(
        JSONUserFuelConsumptionHistorySerializer.serialize(
          userFuelConsumptionHistory,
          totalEntries
        )
      );
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
