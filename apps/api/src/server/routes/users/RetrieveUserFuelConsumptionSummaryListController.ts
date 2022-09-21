import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import {
  RetrieveUserFuelConsumptionSummaryListDTO,
  UserCarErrors,
  UserErrors,
} from "@KPBBFC/user";

import { AppContext } from "../..";

interface RetrieveUserFuelConsumptionSummaryListQuery {
  userCarId: string;
}

export class RetrieveUserFuelConsumptionSummaryListController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveUserFuelConsumptionSummaryListController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const query = this.ctx
      .query as Partial<RetrieveUserFuelConsumptionSummaryListQuery>;

    const dto: Partial<RetrieveUserFuelConsumptionSummaryListDTO> = {
      carId: query.userCarId,
    };

    const cmd: ICommandWithIdentity<
      Partial<RetrieveUserFuelConsumptionSummaryListDTO>,
      Partial<ICommandIdentity>
    > = {
      dto,
      identity: {
        id: this.ctx.identity.id,
      },
    };

    const result =
      await this.ctx.appService.retrieveUserFuelConsumptionSummaryList.execute(
        cmd
      );
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case UserErrors.UserNotFoundError:
        case UserCarErrors.UserCarNotFoundError:
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
