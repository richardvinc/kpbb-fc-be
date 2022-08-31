import { DefaultState, Middleware } from "koa";

import { VerifyAuthTokenDTO } from "@KPBBFC/auth";
import { AuthErrors } from "@KPBBFC/auth/errors";
import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import {
  asMiddleware,
  KoaBaseController,
} from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";

import { AppContext } from "../";

class VerifyAuthTokenController extends KoaBaseController<AppContext> {
  constructor() {
    super("VerifyAuthTokenController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const cmd: ICommand<Partial<VerifyAuthTokenDTO>> = {
      dto: {
        token: this.ctx.identity.token,
      },
    };

    const result = await this.ctx.appService.verifyAuthToken.execute(cmd);

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
      this.ctx.identity.id = payload;
    }

    logger.trace(`END`);
  }
}

export function VerifyAuthToken(): Middleware<DefaultState, AppContext> {
  const ctrl = new VerifyAuthTokenController();
  return asMiddleware(ctrl);
}
