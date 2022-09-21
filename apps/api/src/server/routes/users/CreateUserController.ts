import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { CreateUserDTO, UserErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface CreateUserBody {
  user: {
    username: string;
  };
}

export class CreateUserController extends KoaBaseController<AppContext> {
  constructor() {
    super("CreateUserController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const body = (this.ctx.request as any).body as CreateUserBody;
    const identity = this.ctx.identity;

    const cmd: ICommand<Partial<CreateUserDTO>> = {
      dto: {
        user: {
          username: body.user.username,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          firebaseUid: identity.firebaseUid!,
        },
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
      const data = result.value;
      this.ok({ data });
    }

    logger.trace(`END`);
  }
}
