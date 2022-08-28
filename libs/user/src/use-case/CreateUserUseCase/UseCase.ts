import {
    BaseResponse, getCurrentHub, InternalError, left, right, UniqueEntityId, UseCase,
} from "@kopeka/core";

import { User, Username } from "../../domains";
import { UserErrors } from "../../errors";
import { IUSerService } from "../../services/IUserService";
import {
    CreateUserCommand, CreateUserCommandSchema, CreateUserDTO, CreateUserPayload,
} from "./Command";

interface Cradle {
  userService: IUSerService;
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

  private userService: IUSerService;

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

    const { identity, dto } = req;

    try {
      const userExists = await this.userService.get({
        selection: {
          id: new UniqueEntityId(identity.id),
        },
      });

      if (userExists)
        return left(new UserErrors.UserAlreadyExistsError(identity.id));

      const user = User.create({
        username: Username.create(dto.user.username),
      });

      await this.userService.createUser(user);

      logger.trace(`END`);
      return right(user);
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
