import { CarErrors, RetrieveCarListDTO } from "@KPBBFC/car";
import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";

import { AppContext } from "../..";

interface RetrieveCarListQuery {
  search?: string;
  carBrandIds?: string;
  carModelIds?: string;
  limit?: number;
  page?: number;
}

export class RetrieveCarListController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveCarListController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const query = this.ctx.query as Partial<RetrieveCarListQuery>;

    const cmd: ICommand<Partial<RetrieveCarListDTO>> = {
      dto: {
        by: {
          search: query.search,
        },
        filter: {
          carBrandIds: query.carBrandIds?.split(","),
          carModelIds: query.carModelIds?.split(","),
          limit: query.limit ?? 20,
          page: query.page ?? 1,
        },
      },
    };

    const result = await this.ctx.appService.retrieveCarList.execute(cmd);
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case CarErrors.CarNotFoundError:
        case RequestError.InvalidArgumentError:
          this.badRequest(error);
          break;
        default:
          this.fail(error);
          break;
      }
    } else {
      const cars = result.value;
      this.ok({ cars });
    }

    logger.trace(`END`);
  }
}
