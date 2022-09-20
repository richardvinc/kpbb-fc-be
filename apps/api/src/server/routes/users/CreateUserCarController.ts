import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { CreateUserCarDTO, UserCarErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface CreateUserCarBody {
  car: {
    carSubModelId: string;
    plateNumber: string;
  };
}

export class CreateUserCarController extends KoaBaseController<AppContext> {
  constructor() {
    super("CreateUserCarController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const body = (this.ctx.request as any).body as CreateUserCarBody;
    const identity = this.ctx.identity;

    const cmd: ICommandWithIdentity<
      Partial<CreateUserCarDTO>,
      Partial<ICommandIdentity>
    > = {
      dto: {
        car: {
          carSubModelId: body.car.carSubModelId,
          plateNumber: body.car.plateNumber,
        },
      },
      identity: {
        id: identity.id,
      },
    };

    const result = await this.ctx.appService.createUserCar.execute(cmd);
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case UserCarErrors.UserCarAlreadyExistsError:
        case UserCarErrors.UserCarModelNotFoundError:
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
