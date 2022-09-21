import { date, number, object } from "joi";

import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";

import { User } from "./User";
import { UserCar } from "./UserCar";

interface UserFuelConsumptionSummaryProps {
  userId: UniqueEntityId;
  userCarId: UniqueEntityId;

  carBrandId: UniqueEntityId;
  carModelId: UniqueEntityId;
  carSubModelId: UniqueEntityId;

  totalKmTravelled: number;
  totalFuelFilled: number;
  average: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class UserFuelConsumptionSummary extends AggregateRoot<UserFuelConsumptionSummaryProps> {
  _user?: User;
  _car?: UserCar;

  private static schema = object<UserFuelConsumptionSummaryProps>({
    userId: object().required(),
    userCarId: object().required(),

    carBrandId: object().required(),
    carModelId: object().required(),
    carSubModelId: object().required(),

    totalKmTravelled: number().required(),
    totalFuelFilled: number().required(),
    average: number().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(
    props: UserFuelConsumptionSummaryProps,
    id?: UniqueEntityId
  ) {
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

  get carBrandId(): UniqueEntityId {
    return this.props.carBrandId;
  }

  get carModelId(): UniqueEntityId {
    return this.props.carModelId;
  }

  get carSubModelId(): UniqueEntityId {
    return this.props.carSubModelId;
  }

  get totalKmTravelled(): number {
    return this.props.totalKmTravelled;
  }

  get totalFuelFilled(): number {
    return this.props.totalFuelFilled;
  }

  get average(): number {
    return this.props.average;
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
    props: UserFuelConsumptionSummaryProps,
    id?: UniqueEntityId
  ): UserFuelConsumptionSummary {
    const guardResult = Guard.against<UserFuelConsumptionSummaryProps>(
      this.schema,
      props
    );
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "UserFuelConsumptionSummary",
        guardResult.message
      );
    } else {
      return new UserFuelConsumptionSummary(
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
