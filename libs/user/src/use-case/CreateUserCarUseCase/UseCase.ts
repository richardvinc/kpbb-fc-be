import { ICarService, PlateNumber } from "@KPBBFC/car";
import {
  BaseResponse,
  getCurrentHub,
  InternalError,
  left,
  right,
  UniqueEntityId,
  UseCase,
} from "@KPBBFC/core";

import { UserCar } from "../../domains";
import { UserCarErrors, UserErrors } from "../../errors";
import { JSONUserCarSerializer } from "../../serializers";
import { IUserCarService } from "../../services";
import {
  CreateUserCarCommand,
  CreateUserCarCommandSchema,
  CreateUserCarDTO,
  CreateUserCarPayload,
} from "./Command";

interface Cradle {
  userCarService: IUserCarService;
  carService: ICarService;
}

export type CreateUserCarResponse = BaseResponse<
  | UserErrors.UserAlreadyExistsError
  | UserCarErrors.UserCarAlreadyExistsError
  | UserCarErrors.UserCarModelNotFoundError,
  CreateUserCarPayload
>;

export class CreateUserCarUseCase extends UseCase<
  CreateUserCarDTO,
  CreateUserCarPayload,
  CreateUserCarResponse
> {
  protected schema = CreateUserCarCommandSchema;

  private userCarService: IUserCarService;
  private carService: ICarService;

  constructor(cradle: Cradle) {
    super("CreateUserCarUseCase");

    this.userCarService = cradle.userCarService;
    this.carService = cradle.carService;
  }

  async handler(req: CreateUserCarCommand): Promise<CreateUserCarResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    const { identity, dto } = req;
    const userId = new UniqueEntityId(identity.id);

    try {
      const carExists = await this.userCarService.get({
        selection: {
          userId,
          plateNumber: PlateNumber.create(dto.car.plateNumber),
        },
      });
      if (carExists)
        return left(
          new UserCarErrors.UserCarAlreadyExistsError(dto.car.plateNumber)
        );

      const carSubModel = await this.carService.getCarSubModel({
        selection: {
          id: new UniqueEntityId(dto.car.carSubModelId),
        },
      });
      if (!carSubModel)
        return left(new UserCarErrors.UserCarModelNotFoundError());

      const userCar = UserCar.create({
        userId,
        carBrandId: carSubModel.brandId,
        carModelId: carSubModel.modelId,
        carSubModelId: carSubModel.id,
        plateNumber: PlateNumber.create(dto.car.plateNumber),
      });
      userCar.setCar(carSubModel);

      await this.userCarService.createUserCar(userCar);

      logger.trace(`END`);
      return right(JSONUserCarSerializer.serialize(userCar));
    } catch (err) {
      logger.warn({ error: err });
      return left(new InternalError.UnexpectedError(err as Error));
    }
  }
}
