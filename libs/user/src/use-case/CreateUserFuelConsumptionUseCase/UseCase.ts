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
import {
  FuelConsumption,
  FuelConsumptionErrors,
} from "@KPBBFC/fuelConsumption";

import { UserFuelConsumption } from "../../domains";
import { UserFuelConsumptionOrderFields } from "../../repositories";
import { JSONUserFuelConsumptionSerializer } from "../../serializers";
import { IUserFuelConsumptionService } from "../../services";
import {
  CreateUserFuelConsumptionCommand,
  CreateUserFuelConsumptionCommandSchema,
  CreateUserFuelConsumptionDTO,
  CreateUserFuelConsumptionPayload,
} from "./Command";

interface Cradle {
  userFuelConsumptionService: IUserFuelConsumptionService;
}

export type CreateUserFuelConsumptionResponse = BaseResponse<
  FuelConsumptionErrors.FuelConsumptionKmTravelledEqualOrLessThanPrevious,
  CreateUserFuelConsumptionPayload
>;

export class CreateUserFuelConsumptionUseCase extends UseCase<
  CreateUserFuelConsumptionDTO,
  CreateUserFuelConsumptionPayload,
  CreateUserFuelConsumptionResponse
> {
  protected schema = CreateUserFuelConsumptionCommandSchema;

  private userFuelConsumptionService: IUserFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("CreateUserFuelConsumptionUseCase");

    this.userFuelConsumptionService = cradle.userFuelConsumptionService;
  }

  async handler(
    req: CreateUserFuelConsumptionCommand
  ): Promise<CreateUserFuelConsumptionResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { identity, dto } = req;
    const userId = new UniqueEntityId(identity.id);

    try {
      const lastUserFuelConsumption = (
        await this.userFuelConsumptionService.getAll({
          selection: {
            userIds: [new UniqueEntityId(identity.id)],
            userCarIds: [new UniqueEntityId(dto.fuelConsumption.carId)],
          },
          orderBy: [
            UserFuelConsumptionOrderFields.FILLED_AT,
            OrderDirection.DESC,
          ],
          limit: 1,
        })
      )[0]; // can be undefined

      if (lastUserFuelConsumption) {
        if (
          dto.fuelConsumption.kmTravelled <=
          lastUserFuelConsumption.fuelConsumption.kmTravelled
        ) {
          return left(
            new FuelConsumptionErrors.FuelConsumptionKmTravelledEqualOrLessThanPrevious()
          );
        }
      }

      const userFuelConsumption = UserFuelConsumption.create({
        userId,
        userCarId: new UniqueEntityId(dto.fuelConsumption.carId),
        fuelConsumption: FuelConsumption.create({
          kmTravelled: dto.fuelConsumption.kmTravelled,
          fuelFilled: dto.fuelConsumption.fuelFilled,
          average: FuelConsumption.calculateAverage(
            dto.fuelConsumption.fuelFilled,
            dto.fuelConsumption.kmTravelled,
            lastUserFuelConsumption?.fuelConsumption.kmTravelled
          ),
          filledAt: dto.fuelConsumption.filledAt,
        }),
      });

      await this.userFuelConsumptionService.persist(userFuelConsumption);

      logger.trace(`END`);
      return right(
        JSONUserFuelConsumptionSerializer.serialize(userFuelConsumption)
      );
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
