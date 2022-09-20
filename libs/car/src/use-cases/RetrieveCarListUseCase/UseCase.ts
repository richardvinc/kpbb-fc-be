import { CarErrors } from "@KPBBFC/car/errors";
import { JSONCarSubModelSerializer } from "@KPBBFC/car/serializers";
import { ICarService } from "@KPBBFC/car/services";
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
  RetrieveCarListCommand,
  RetrieveCarListCommandSchema,
  RetrieveCarListDTO,
  RetrieveCarListPayload,
} from "./Command";

interface Cradle {
  carService: ICarService;
}

export type RetrieveCarListResponse = BaseResponse<
  CarErrors.CarNotFoundError,
  RetrieveCarListPayload
>;

export class RetrieveCarListUseCase extends UseCase<
  RetrieveCarListDTO,
  RetrieveCarListPayload,
  RetrieveCarListResponse
> {
  protected schema = RetrieveCarListCommandSchema;

  private carService: ICarService;

  constructor(cradle: Cradle) {
    super("RetrieveCarListUseCase");

    this.carService = cradle.carService;
  }

  async handler(req: RetrieveCarListCommand): Promise<RetrieveCarListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { dto } = req;

    try {
      const cars = await this.carService.getAllCarSubModel({
        selection: {
          brandIds: dto.filter?.carBrandIds?.map(
            (id) => new UniqueEntityId(id)
          ),
          modelIds: dto.filter?.carModelIds?.map(
            (id) => new UniqueEntityId(id)
          ),
        },
        search: dto.by?.search,
        limit: dto.filter?.limit,
        page: dto.filter?.page,
      });

      if (cars.length < 0) return left(new CarErrors.CarNotFoundError());

      logger.trace(`END`);
      return right(
        cars.map((user) => JSONCarSubModelSerializer.serialize(user))
      );
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
