import { date, number, object } from "joi";

import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";

interface UserFuelConsumptionProps {
  userId: UniqueEntityId;
  userCarId: UniqueEntityId;

  kmTravelled: number;
  fuelFilled: number;
  average: number;

  filledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class UserFuelConsumption extends AggregateRoot<UserFuelConsumptionProps> {
  private static schema = object<UserFuelConsumptionProps>({
    userId: object().required(),
    userCarId: object().required(),
    kmTravelled: number().required(),
    fuelFilled: number().required(),
    average: number().required(),

    filledAt: date().required(),
    createdAt: date().required(),
    updatedAt: date().required(),
    deletedAt: date().optional(),
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

  get userCarId(): UniqueEntityId {
    return this.props.userCarId;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
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
