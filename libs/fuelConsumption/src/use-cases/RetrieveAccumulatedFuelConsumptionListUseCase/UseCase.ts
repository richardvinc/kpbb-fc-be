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
import { JSONAccumulatedFuelConsumptionSerializer } from "@KPBBFC/fuelConsumption/serializers";
import { IAccumulatedFuelConsumptionService } from "@KPBBFC/fuelConsumption/services";

import {
  RetrieveAccumulatedFuelConsumptionListCommand,
  RetrieveAccumulatedFuelConsumptionListCommandSchema,
  RetrieveAccumulatedFuelConsumptionListDTO,
  RetrieveAccumulatedFuelConsumptionListPayload,
} from "./Command";

interface Cradle {
  accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;
}

export type RetrieveAccumulatedFuelConsumptionListResponse = BaseResponse<
  BaseError,
  RetrieveAccumulatedFuelConsumptionListPayload
>;

export class RetrieveAccumulatedFuelConsumptionListUseCase extends UseCase<
  RetrieveAccumulatedFuelConsumptionListDTO,
  RetrieveAccumulatedFuelConsumptionListPayload,
  RetrieveAccumulatedFuelConsumptionListResponse
> {
  protected schema = RetrieveAccumulatedFuelConsumptionListCommandSchema;

  private accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("RetrieveAccumulatedFuelConsumptionListUseCase");

    this.accumulatedFuelConsumptionService =
      cradle.accumulatedFuelConsumptionService;
  }

  async handler(
    req: RetrieveAccumulatedFuelConsumptionListCommand
  ): Promise<RetrieveAccumulatedFuelConsumptionListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const dto = req.dto;

    try {
      const results = await this.accumulatedFuelConsumptionService.getAll({
        selection: {
          carBrandIds: dto.carBrandId
            ? [new UniqueEntityId(dto.carBrandId)]
            : undefined,
          carModelIds: dto.carModelId
            ? [new UniqueEntityId(dto.carModelId)]
            : undefined,
          carSubModelIds: dto.carSubModelId
            ? [new UniqueEntityId(dto.carSubModelId)]
            : undefined,
        },
        limit: dto.limit,
        page: dto.page,
      });

      logger.trace(`END`);

      const response = results.map((r) =>
        JSONAccumulatedFuelConsumptionSerializer.serialize(r)
      );

      return right(response);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
