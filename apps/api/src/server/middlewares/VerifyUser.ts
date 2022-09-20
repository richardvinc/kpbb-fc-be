import { DefaultState, Middleware } from "koa";

import { AuthErrors } from "@KPBBFC/auth/errors";
import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import {
  asMiddleware,
  KoaBaseController,
} from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { RetrieveUserDTO } from "@KPBBFC/user";

import { AppContext } from "../";

class VerifyUserController extends KoaBaseController<AppContext> {
  constructor() {
    super("VerifyUserController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const cmd: ICommand<Partial<RetrieveUserDTO>> = {
      dto: {
        by: {
          firebaseUid: this.ctx.identity.firebaseUid,
        },
      },
    };

    const result = await this.ctx.appService.retrieveUser.execute(cmd);

    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case AuthErrors.InvalidToken:
        case RequestError.InvalidArgumentError:
          this.badRequest(error);
          break;
        default:
          this.fail(error);
      }
    } else {
      const payload = result.value;
      this.ctx.identity.id = payload.id;
    }

    logger.trace(`END`);
  }
}

export function VerifyUser(): Middleware<DefaultState, AppContext> {
  const ctrl = new VerifyUserController();
  return asMiddleware(ctrl);
}
