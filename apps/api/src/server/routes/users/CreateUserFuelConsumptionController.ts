import { RequestError } from "@KPBBFC/core/errors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { KoaBaseController } from "@KPBBFC/core/infrastructure/http/koa";
import { FuelConsumptionErrors } from "@KPBBFC/fuelConsumption";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { CreateUserFuelConsumptionDTO, UserCarErrors } from "@KPBBFC/user";

import { AppContext } from "../..";

interface CreateUserFuelConsumptionBody {
  fuelConsumption: {
    kmTravelled: number;
    fuelFilled: number;
    filledAt?: Date;
    average?: number;
  };
}

interface CreateUserFuelConsumptionParams {
  userCarId: string;
}

export class CreateUserFuelConsumptionController extends KoaBaseController<AppContext> {
  constructor() {
    super("CreateUserFuelConsumptionController");
  }

  async executeImpl(): Promise<void> {
    const logger = this.logger.child({
      method: "executeImpl",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    const body = (this.ctx.request as any)
      .body as CreateUserFuelConsumptionBody;
    const params = this.ctx.params as CreateUserFuelConsumptionParams;
    const identity = this.ctx.identity;

    const cmd: ICommandWithIdentity<
      Partial<CreateUserFuelConsumptionDTO>,
      Partial<ICommandIdentity>
    > = {
      dto: {
        fuelConsumption: {
          carId: params.userCarId,
          kmTravelled: body.fuelConsumption.kmTravelled,
          fuelFilled: body.fuelConsumption.fuelFilled,
          average: body.fuelConsumption.average,
          filledAt: body.fuelConsumption.filledAt ?? new Date(),
        },
      },
      identity: {
        id: identity.id,
      },
    };

    const result = await this.ctx.appService.createUserFuelConsumption.execute(
      cmd
    );
    if (result.isLeft()) {
      const error = result.error;
      switch (error.constructor) {
        case UserCarErrors.UserCarNotFoundError:
        case FuelConsumptionErrors.FuelConsumptionKmTravelledEqualOrLessThanPrevious:
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
