import {
  BaseError,
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";
import { FuelConsumptionErrors } from "@KPBBFC/fuelConsumption/errors";
import { JSONAccumulatedFuelConsumptionSerializer } from "@KPBBFC/fuelConsumption/serializers";
import { IAccumulatedFuelConsumptionService } from "@KPBBFC/fuelConsumption/services";

import {
  RetrieveAccumulatedFuelConsumptionByCarCommand,
  RetrieveAccumulatedFuelConsumptionByCarCommandSchema,
  RetrieveAccumulatedFuelConsumptionByCarDTO,
  RetrieveAccumulatedFuelConsumptionByCarPayload,
} from "./Command";

interface Cradle {
  accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;
}

export type RetrieveAccumulatedFuelConsumptionByCarResponse = BaseResponse<
  BaseError | FuelConsumptionErrors.FuelConsumptionNotFound,
  RetrieveAccumulatedFuelConsumptionByCarPayload
>;

export class RetrieveAccumulatedFuelConsumptionByCarUseCase extends UseCase<
  RetrieveAccumulatedFuelConsumptionByCarDTO,
  RetrieveAccumulatedFuelConsumptionByCarPayload,
  RetrieveAccumulatedFuelConsumptionByCarResponse
> {
  protected schema = RetrieveAccumulatedFuelConsumptionByCarCommandSchema;

  private accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("RetrieveAccumulatedFuelConsumptionByCarUseCase");

    this.accumulatedFuelConsumptionService =
      cradle.accumulatedFuelConsumptionService;
  }

  async handler(
    req: RetrieveAccumulatedFuelConsumptionByCarCommand
  ): Promise<RetrieveAccumulatedFuelConsumptionByCarResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const dto = req.dto;

    try {
      const result = await this.accumulatedFuelConsumptionService.get({
        selection: {
          carSubModelId: new UniqueEntityId(dto.carSubModelId),
        },
      });

      if (!result) {
        return left(new FuelConsumptionErrors.FuelConsumptionNotFound());
      }

      logger.trace(`END`);

      const response =
        JSONAccumulatedFuelConsumptionSerializer.serialize(result);

      return right(response);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
