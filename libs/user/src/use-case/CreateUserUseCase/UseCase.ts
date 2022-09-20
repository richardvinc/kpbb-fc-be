import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UseCase,
} from "@KPBBFC/core";

import { User, Username } from "../../domains";
import { UserErrors } from "../../errors";
import { JSONUserSerializer } from "../../serializers";
import { IUserService } from "../../services/IUserService";
import {
  CreateUserCommand,
  CreateUserCommandSchema,
  CreateUserDTO,
  CreateUserPayload,
} from "./Command";

interface Cradle {
  userService: IUserService;
}

export type CreateUserResponse = BaseResponse<
  UserErrors.UserAlreadyExistsError,
  CreateUserPayload
>;

export class CreateUserUseCase extends UseCase<
  CreateUserDTO,
  CreateUserPayload,
  CreateUserResponse
> {
  protected schema = CreateUserCommandSchema;

  private userService: IUserService;

  constructor(cradle: Cradle) {
    super("CreateUSerUseCase");

    this.userService = cradle.userService;
  }

  async handler(req: CreateUserCommand): Promise<CreateUserResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { dto } = req;

    try {
      const userExists = await this.userService.get({
        selection: {
          firebaseUid: dto.user.firebaseUid,
          username: dto.user.username
            ? Username.create(dto.user.username)
            : undefined,
        },
      });

      if (userExists)
        return left(
          new UserErrors.UserAlreadyExistsError(dto.user.firebaseUid)
        );

      const user = User.create({
        username: Username.create(dto.user.username),
        firebaseUid: dto.user.firebaseUid,
      });

      await this.userService.createUser(user);

      logger.trace(`END`);
      return right(JSONUserSerializer.serialize(user));
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
