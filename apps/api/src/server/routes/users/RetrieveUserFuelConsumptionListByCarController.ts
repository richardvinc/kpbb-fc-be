import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import {
  RetrieveUserFuelConsumptionListByCarDTO,
  UserCarErrors,
  UserErrors,
} from "@KPBBFC/user";

import { AppContext } from "../..";

interface RetrieveUserFuelConsumptionListByCarParams {
  userCarId: string;
}

interface RetrieveUserFuelConsumptionListByCarQuery {
  limit: number;
  page: number;
}

export class RetrieveUserFuelConsumptionListByCarController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveUserFuelConsumptionListByCarController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const params = this.ctx
      .params as RetrieveUserFuelConsumptionListByCarParams;
    const query = this.ctx
      .query as Partial<RetrieveUserFuelConsumptionListByCarQuery>;

    const dto: RetrieveUserFuelConsumptionListByCarDTO = {
      carId: params.userCarId,
      limit: query.limit ?? 10,
      page: query.page ?? 1,
    };

    const cmd: ICommandWithIdentity<
      Partial<RetrieveUserFuelConsumptionListByCarDTO>,
      Partial<ICommandIdentity>
    > = {
      dto,
      identity: {
        id: this.ctx.identity.id,
      },
    };

    const result =
      await this.ctx.appService.retrieveUserFuelConsumptionListByCar.execute(
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
