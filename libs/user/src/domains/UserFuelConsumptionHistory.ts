import { array, object } from "joi";

import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";
import { FuelConsumption } from "@KPBBFC/fuelConsumption";

import { User } from "./User";
import { UserCar } from "./UserCar";

interface UserFuelConsumptionHistoryProps {
  user: User;
  car: UserCar;

  fuelConsumptions: FuelConsumption[];
}

export class UserFuelConsumptionHistory extends AggregateRoot<UserFuelConsumptionHistoryProps> {
  private static schema = object<UserFuelConsumptionHistoryProps>({
    user: object().required(),
    car: object().required(),
    fuelConsumptions: array().items(object()).required(),
  }).required();

  private constructor(
    props: UserFuelConsumptionHistoryProps,
    id?: UniqueEntityId
  ) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get user(): User {
    return this.props.user;
  }

  get car(): UserCar {
    return this.props.car;
  }

  get fuelConsumptions(): FuelConsumption[] {
    return this.props.fuelConsumptions;
  }

  public static create(
    props: UserFuelConsumptionHistoryProps,
    id?: UniqueEntityId
  ): UserFuelConsumptionHistory {
    const guardResult = Guard.against<UserFuelConsumptionHistoryProps>(
      this.schema,
      props
    );
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "UserFuelConsumptionHistory",
        guardResult.message
      );
    } else {
      return new UserFuelConsumptionHistory(
        {
          ...props,
        },
        id
      );
    }
  }
}
