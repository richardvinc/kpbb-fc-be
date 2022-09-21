import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { RetrieveUserCarListDTO, UserCarErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

export class RetrieveUserCarListController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveUserCarListController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const cmd: ICommandWithIdentity<
      Partial<RetrieveUserCarListDTO>,
      Partial<ICommandIdentity>
    > = {
      dto: {},
      identity: {
        id: this.ctx.identity.id,
      },
    };

    const result = await this.ctx.appService.retrieveUserCarList.execute(cmd);
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
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
