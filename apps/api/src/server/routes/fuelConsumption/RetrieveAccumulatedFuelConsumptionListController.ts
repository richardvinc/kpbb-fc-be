import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { RetrieveAccumulatedFuelConsumptionListDTO } from "@KPBBFC/fuelConsumption";
import { ICommand } from "@KPBBFC/types";

import { AppContext } from "../..";

interface RetrieveAccumulatedFuelConsumptionListQuery {
  carBrandId?: string;
  carModelId?: string;
  carSubModelId?: string;
  limit?: number;
  page?: number;
}

export class RetrieveAccumulatedFuelConsumptionListController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveAccumulatedFuelConsumptionListController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const query = this.ctx
      .query as Partial<RetrieveAccumulatedFuelConsumptionListQuery>;

    const cmd: ICommand<Partial<RetrieveAccumulatedFuelConsumptionListDTO>> = {
      dto: {
        carBrandId: query.carBrandId,
        carModelId: query.carModelId,
        carSubModelId: query.carSubModelId,
        limit: query.limit ?? 10,
        page: query.page ?? 1,
      },
    };

    const result =
      await this.ctx.appService.retrieveAccumulatedFuelConsumptionList.execute(
        cmd
      );
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case RequestError.InvalidArgumentError:
          this.badRequest(error);
          break;
        default:
          this.fail(error);
          break;
      }
    } else {
      const data = result.value;
      this.ok({ cars: data });
    }

    logger.trace(`END`);
  }
}
