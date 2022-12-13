import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { RetrieveTop10AccumulatedFuelConsumptionListDTO } from "@KPBBFC/fuelConsumption";
import { ICommand } from "@KPBBFC/types";

import { AppContext } from "../..";

export class RetrieveTop10AccumulatedFuelConsumptionListController extends KoaBaseController<AppContext> {
  _isCar = true;
  constructor(isCar = true) {
    super("RetrieveTop10AccumulatedFuelConsumptionListController");
    this._isCar = isCar;
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const cmd: ICommand<
      Partial<RetrieveTop10AccumulatedFuelConsumptionListDTO>
    > = {
      dto: {
        isCar: this._isCar ?? true,
      },
    };

    const result =
      await this.ctx.appService.retrieveTop10AccumulatedFuelConsumptionList.execute(
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
      this.ok({ data });
    }

    logger.trace(`END`);
  }
}
