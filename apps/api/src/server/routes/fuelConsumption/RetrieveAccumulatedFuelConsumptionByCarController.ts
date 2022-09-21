import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { RetrieveAccumulatedFuelConsumptionByCarDTO } from "@KPBBFC/fuelConsumption";
import { FuelConsumptionErrors } from "@KPBBFC/fuelConsumption/errors";
import { ICommand } from "@KPBBFC/types";

import { AppContext } from "../..";

interface RetrieveAccumulatedFuelConsumptionByCarParams {
  id?: string;
}

export class RetrieveAccumulatedFuelConsumptionByCarController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveAccumulatedFuelConsumptionByCarController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const params = this.ctx
      .params as Partial<RetrieveAccumulatedFuelConsumptionByCarParams>;

    const cmd: ICommand<Partial<RetrieveAccumulatedFuelConsumptionByCarDTO>> = {
      dto: {
        carSubModelId: params.id,
      },
    };

    const result =
      await this.ctx.appService.retrieveAccumulatedFuelConsumptionByCar.execute(
        cmd
      );

    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case FuelConsumptionErrors.FuelConsumptionNotFound:
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
