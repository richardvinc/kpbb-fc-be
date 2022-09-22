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
import { GetAllAccumulatedFuelConsumptionSelection } from "@KPBBFC/fuelConsumption/repositories";
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
      const filter: GetAllAccumulatedFuelConsumptionSelection = {
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
          search: dto.search,
        },
        limit: dto.limit,
        page: dto.page,
      };
      const results = await this.accumulatedFuelConsumptionService.getAll(
        filter
      );
      const totalEntries =
        await this.accumulatedFuelConsumptionService.getCount(filter);

      logger.trace(`END`);

      const response = JSONAccumulatedFuelConsumptionSerializer.serializeList(
        results,
        totalEntries
      );

      return right(response);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
