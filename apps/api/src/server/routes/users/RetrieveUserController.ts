import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { ICommand } from "@KPBBFC/types";
import { RetrieveUserDTO, UserErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface RetrieveUserParams {
  id: string;
}

interface RetrieveUserQuery {
  by: "id" | "firebaseUid" | "username";
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
    const query = this.ctx.query as Partial<RetrieveUserQuery>;

    let dto: Partial<RetrieveUserDTO> = {};
    switch (query.by) {
      case "id":
        dto = {
          by: {
            id: params.id,
          },
        };
        break;
      case "firebaseUid":
        dto = {
          by: {
            firebaseUid: params.id,
          },
        };
        break;
      case "username":
        dto = {
          by: {
            username: params.id,
          },
        };
        break;
      default:
        dto = {
          by: {
            id: params.id,
          },
        };
        break;
    }

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
