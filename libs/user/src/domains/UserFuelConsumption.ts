import { date, object } from "joi";

import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";
import { FuelConsumption } from "@KPBBFC/fuelConsumption";

import { User } from "./User";
import { UserCar } from "./UserCar";

interface UserFuelConsumptionProps {
  userId: UniqueEntityId;
  userCarId: UniqueEntityId;

  fuelConsumption: FuelConsumption;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class UserFuelConsumption extends AggregateRoot<UserFuelConsumptionProps> {
  _user?: User;
  _car?: UserCar;

  private static schema = object<UserFuelConsumptionProps>({
    userId: object().required(),
    userCarId: object().required(),
    fuelConsumption: object().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: UserFuelConsumptionProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get user(): User | undefined {
    return this._user;
  }

  get userCarId(): UniqueEntityId {
    return this.props.userCarId;
  }

  get car(): UserCar | undefined {
    return this._car;
  }

  get fuelConsumption(): FuelConsumption {
    return this.props.fuelConsumption;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  setUser(user: User): void {
    this._user = user;
  }

  setCar(car: UserCar): void {
    this._car = car;
  }

  public static create(
    props: UserFuelConsumptionProps,
    id?: UniqueEntityId
  ): UserFuelConsumption {
    const guardResult = Guard.against<UserFuelConsumptionProps>(
      this.schema,
      props
    );
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "UserFuelConsumption",
        guardResult.message
      );
    } else {
      return new UserFuelConsumption(
        {
          ...props,
          createdAt: props.createdAt ?? new Date(),
          updatedAt: props.updatedAt ?? new Date(),
        },
        id
      );
    }
  }
}
