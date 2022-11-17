import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";
import {
  FuelConsumption,
  FuelConsumptionErrors,
  IAccumulatedFuelConsumptionService,
} from "@KPBBFC/fuelConsumption";

import { UserFuelConsumption } from "../../domains";
import { UserCarErrors } from "../../errors";
import { JSONUserFuelConsumptionSerializer } from "../../serializers";
import {
  IUserCarService,
  IUserFuelConsumptionService,
  IUserFuelConsumptionSummaryService,
} from "../../services";
import {
  CreateUserFuelConsumptionCommand,
  CreateUserFuelConsumptionCommandSchema,
  CreateUserFuelConsumptionDTO,
  CreateUserFuelConsumptionPayload,
} from "./Command";

interface Cradle {
  userCarService: IUserCarService;
  userFuelConsumptionService: IUserFuelConsumptionService;
  userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;
  accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;
}

export type CreateUserFuelConsumptionResponse = BaseResponse<
  | FuelConsumptionErrors.FuelConsumptionKmTravelledEqualOrLessThanPrevious
  | UserCarErrors.UserCarNotFoundError,
  CreateUserFuelConsumptionPayload
>;

export class CreateUserFuelConsumptionUseCase extends UseCase<
  CreateUserFuelConsumptionDTO,
  CreateUserFuelConsumptionPayload,
  CreateUserFuelConsumptionResponse
> {
  protected schema = CreateUserFuelConsumptionCommandSchema;

  private userCarService: IUserCarService;
  private userFuelConsumptionService: IUserFuelConsumptionService;
  private userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;
  private accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("CreateUserFuelConsumptionUseCase");

    this.userCarService = cradle.userCarService;
    this.userFuelConsumptionService = cradle.userFuelConsumptionService;
    this.userFuelConsumptionSummaryService =
      cradle.userFuelConsumptionSummaryService;
    this.accumulatedFuelConsumptionService =
      cradle.accumulatedFuelConsumptionService;
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
    const userCarId = new UniqueEntityId(dto.fuelConsumption.carId);

    const filter = {
      selection: {
        id: userCarId,
        userId,
      },
    };

    const userCar = await this.userCarService.get(filter);
    if (!userCar) return left(new UserCarErrors.UserCarNotFoundError());

    try {
      const lastUserFuelConsumption =
        await this.userFuelConsumptionService.getLastEntry(filter);

      // if (lastUserFuelConsumption) {
      //   if (
      //     dto.fuelConsumption.kmTravelled <=
      //     lastUserFuelConsumption.fuelConsumption.kmTravelled
      //   ) {
      //     return left(
      //       new FuelConsumptionErrors.FuelConsumptionKmTravelledEqualOrLessThanPrevious()
      //     );
      //   }
      // }

      const userFuelConsumption = UserFuelConsumption.create({
        userId,
        userCarId,
        fuelConsumption: FuelConsumption.create({
          kmTravelled: dto.fuelConsumption.kmTravelled,
          fuelFilled: dto.fuelConsumption.fuelFilled,
          average:
            dto.fuelConsumption.average && dto.fuelConsumption.average !== 0
              ? dto.fuelConsumption.average
              : FuelConsumption.calculateAverage(
                  dto.fuelConsumption.fuelFilled,
                  dto.fuelConsumption.kmTravelled,
                  lastUserFuelConsumption?.fuelConsumption.kmTravelled
                ),
          filledAt: dto.fuelConsumption.filledAt,
        }),
      });

      await this.userFuelConsumptionService.persist(userFuelConsumption);

      // calculate properties for user fuel consumption summary
      await this.userFuelConsumptionSummaryService.calculateProperties(
        userCarId
      );
      // calculate properties for accumulated fuel consumption based on car sub model id
      await this.accumulatedFuelConsumptionService.calculateProperties(
        userCar.carSubModelId
      );

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
