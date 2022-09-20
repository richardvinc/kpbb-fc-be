import { date, number, object } from "joi";

import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";

import { User } from "./User";
import { UserCar } from "./UserCar";

interface UserFuelConsumptionProps {
  userId: UniqueEntityId;
  userCarId: UniqueEntityId;

  kmTravelled: number;
  fuelFilled: number;
  average: number;

  filledAt: Date;
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
    kmTravelled: number().required(),
    fuelFilled: number().required(),
    average: number().required(),

    filledAt: date().required(),
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

  get kmTravelled(): number {
    return this.props.kmTravelled;
  }

  get fuelFilled(): number {
    return this.props.fuelFilled;
  }

  get average(): number {
    return this.props.average;
  }

  get filledAt(): Date {
    return this.props.filledAt;
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

  static calculateAverage(
    fuelFilled: number,
    kmTravelled: number,
    kmTravelledPrevious: number | undefined
  ): number {
    if (!kmTravelledPrevious) return 0;

    return fuelFilled / (kmTravelled - kmTravelledPrevious);
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
