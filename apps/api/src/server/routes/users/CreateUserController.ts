import { RequestError } from "@kopeka/core/errors";
import { getCurrentHub } from "@kopeka/core/hub";
import { KoaBaseController } from "@kopeka/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@kopeka/types";
import { CreateUserDTO, UserErrors } from "@kopeka/user";

import { AppContext } from "../..";

interface CreateUserBody {
  user: {
    username: string;
  };
}

export class CreateUserController extends KoaBaseController<AppContext> {
  constructor() {
    super("RetrieveByIdController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const body = (this.ctx.request as any).body as CreateUserBody;
    const identity = this.ctx.identity;

    const cmd: ICommandWithIdentity<
      Partial<CreateUserDTO>,
      Partial<ICommandIdentity>
    > = {
      dto: {
        user: {
          username: body.user.username,
          firebaseUid: identity.id!,
        },
      },
      identity: {
        id: identity.id,
      },
    };

    const result = await this.ctx.appService.createUser.execute(cmd);
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case UserErrors.UserAlreadyExistsError:
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
