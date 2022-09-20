import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { RetrieveUserDTO, UserErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface RetrieveUserParams {
  id: string;
}

export class RetrieveUserController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveUserController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const params = this.ctx.params as RetrieveUserParams;

    const dto: Partial<RetrieveUserDTO> = {
      by: {
        id: params.id,
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
      const user = result.value;
      this.ok({ user });
    }

    logger.trace(`END`);
  }
}
