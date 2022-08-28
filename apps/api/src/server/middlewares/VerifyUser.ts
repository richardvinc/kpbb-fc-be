import { DefaultState, Middleware } from "koa";

import { VerifyUserDTO } from "@kopeka/auth";
import { AuthErrors } from "@kopeka/auth/errors";
import { RequestError } from "@kopeka/core/errors";
import { getCurrentHub } from "@kopeka/core/hub";
import { asMiddleware, KoaBaseController } from "@kopeka/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@kopeka/types";

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

    const cmd: ICommandWithIdentity<
      Partial<VerifyUserDTO>,
      Partial<ICommandIdentity>
    > = {
      dto: {
        id: this.ctx.identity.id,
      },
      identity: { id: this.ctx.identity.id },
    };

    const result = await this.ctx.appService.retrieveUserById.execute(cmd);

    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case AuthErrors.InvalidToken:
        case AuthErrors.NotRegistered:
        case RequestError.InvalidArgumentError:
          this.badRequest(error);
          break;
        default:
          this.fail(error);
      }
    } else {
      const user = result.value;
      this.ctx.identity.user = user;
    }

    logger.trace(`END`);
  }
}

export function VerifyUser(): Middleware<DefaultState, AppContext> {
  const ctrl = new VerifyUserController();
  return asMiddleware(ctrl);
}
