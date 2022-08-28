import { RequestError } from "@kopeka/core/errors";
import { getCurrentHub } from "@kopeka/core/hub";
import { KoaBaseController } from "@kopeka/core/infrastructure/http/koa";
import { ICommand } from "@kopeka/types";
import { RetrieveUserDTO, UserErrors } from "@kopeka/user";

import { AppContext } from "../..";

interface RetrieveUserParams {
  id?: string;
}

export class RetrieveUserController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveByIdController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const params = this.ctx.params as Partial<RetrieveUserParams>;

    const cmd: ICommand<Partial<RetrieveUserDTO>> = {
      dto: {
        by: { id: params.id },
      },
    };

    if (!params.id) {
      throw new Error("User Id is required");
    }

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
