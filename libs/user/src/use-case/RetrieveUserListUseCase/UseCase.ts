import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UseCase,
} from "@KPBBFC/core";

import { UserErrors } from "../../errors";
import { JSONUserSerializer } from "../../serializers";
import { IUserService } from "../../services/IUserService";
import {
  RetrieveUserListCommand,
  RetrieveUserListCommandSchema,
  RetrieveUserListDTO,
  RetrieveUserListPayload,
} from "./Command";

interface Cradle {
  userService: IUserService;
}

export type RetrieveUserListResponse = BaseResponse<
  UserErrors.UserNotFoundError,
  RetrieveUserListPayload
>;

export class RetrieveUserListUseCase extends UseCase<
  RetrieveUserListDTO,
  RetrieveUserListPayload,
  RetrieveUserListResponse
> {
  protected schema = RetrieveUserListCommandSchema;

  private userService: IUserService;

  constructor(cradle: Cradle) {
    super("RetrieveUserListUseCase");

    this.userService = cradle.userService;
  }

  async handler(
    req: RetrieveUserListCommand
  ): Promise<RetrieveUserListResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { identity, dto } = req;

    try {
      const users = await this.userService.getAll({});

      if (users.length < 0) return left(new UserErrors.UserNotFoundError());

      logger.trace(`END`);
      return right(users.map((user) => JSONUserSerializer.serialize(user)));
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
