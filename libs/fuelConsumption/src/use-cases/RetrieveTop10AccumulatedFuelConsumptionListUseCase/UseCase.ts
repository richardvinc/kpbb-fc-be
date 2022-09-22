import {
  BaseError,
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UseCase,
} from "@KPBBFC/core";
import { JSONAccumulatedFuelConsumptionSerializer } from "@KPBBFC/fuelConsumption/serializers";
import { IAccumulatedFuelConsumptionService } from "@KPBBFC/fuelConsumption/services";

import {
  RetrieveTop10AccumulatedFuelConsumptionListCommand,
  RetrieveTop10AccumulatedFuelConsumptionListCommandSchema,
  RetrieveTop10AccumulatedFuelConsumptionListDTO,
  RetrieveTop10AccumulatedFuelConsumptionListPayload,
} from "./Command";

interface Cradle {
  accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;
}

export type RetrieveTop10AccumulatedFuelConsumptionListResponse = BaseResponse<
  BaseError,
  RetrieveTop10AccumulatedFuelConsumptionListPayload
>;

export class RetrieveTop10AccumulatedFuelConsumptionListUseCase extends UseCase<
  RetrieveTop10AccumulatedFuelConsumptionListDTO,
  RetrieveTop10AccumulatedFuelConsumptionListPayload,
  RetrieveTop10AccumulatedFuelConsumptionListResponse
> {
  protected schema = RetrieveTop10AccumulatedFuelConsumptionListCommandSchema;

  private accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;

  constructor(cradle: Cradle) {
    super("RetrieveTop10AccumulatedFuelConsumptionListUseCase");

    this.accumulatedFuelConsumptionService =
      cradle.accumulatedFuelConsumptionService;
  }

  async handler(
    req: RetrieveTop10AccumulatedFuelConsumptionListCommand
  ): Promise<RetrieveTop10AccumulatedFuelConsumptionListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const dto = req.dto;

    try {
      const results = await this.accumulatedFuelConsumptionService.getTop10();

      const response = results.map((r) =>
        JSONAccumulatedFuelConsumptionSerializer.serialize(r)
      );
      logger.trace(`END`);

      return right(response);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
