import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { RetrieveUserDTO, UserErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

export class RetrieveSelfController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveSelfController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const dto: Partial<RetrieveUserDTO> = {
      by: {
        id: this.ctx.identity.id,
      },
    };

    const cmd: ICommand<Partial<RetrieveUserDTO>> = {
      dto,
    };

    const result = await this.ctx.appService.retrieveUser.execute(cmd);
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case UserErrors.UserNotFoundError:
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
