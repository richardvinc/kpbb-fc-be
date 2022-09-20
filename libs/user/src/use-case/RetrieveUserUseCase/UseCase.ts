import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UseCase,
} from "@KPBBFC/core";

import { Username } from "../../domains";
import { UserErrors } from "../../errors";
import { JSONUserSerializer } from "../../serializers";
import { IUserService } from "../../services/IUserService";
import {
  RetrieveUserCommand,
  RetrieveUserCommandSchema,
  RetrieveUserDTO,
  RetrieveUserPayload,
} from "./Command";

interface Cradle {
  userService: IUserService;
}

export type RetrieveUserResponse = BaseResponse<
  UserErrors.UserNotFoundError,
  RetrieveUserPayload
>;

export class RetrieveUserUseCase extends UseCase<
  RetrieveUserDTO,
  RetrieveUserPayload,
  RetrieveUserResponse
> {
  protected schema = RetrieveUserCommandSchema;

  private userService: IUserService;

  constructor(cradle: Cradle) {
    super("RetrieveUserUseCase");

    this.userService = cradle.userService;
  }

  async handler(req: RetrieveUserCommand): Promise<RetrieveUserResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { dto } = req;

    try {
      const user = await this.userService.get({
        selection: {
          id: dto.by?.id ? dto.by.id : undefined,
          firebaseUid: dto.by?.firebaseUid ? dto.by.firebaseUid : undefined,
          username: dto.by?.username
            ? Username.create(dto.by.username)
            : undefined,
        },
      });

      if (!user) return left(new UserErrors.UserNotFoundError());

      logger.trace(`END`);
      return right(JSONUserSerializer.serialize(user));
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
