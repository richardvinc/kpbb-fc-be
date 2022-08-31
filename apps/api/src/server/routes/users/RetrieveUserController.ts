import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { RetrieveUserDTO, UserErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface RetrieveUserQuery {
  id?: string;
  firebaseUid?: string;
  username?: string;
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

    const query = this.ctx.query as Partial<RetrieveUserQuery>;

    const cmd: ICommand<Partial<RetrieveUserDTO>> = {
      dto: {
        by: {
          id: query.id,
          firebaseUid: query.firebaseUid,
          username: query.username,
        },
      },
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
