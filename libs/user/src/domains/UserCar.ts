import { date, object } from "joi";

import { CarSubModel, PlateNumber } from "@KPBBFC/car";
import {
  AggregateRoot,
  Guard,
  InternalError,
  UniqueEntityId,
} from "@KPBBFC/core";

import { User } from "./User";

interface UserCarProps {
  userId: UniqueEntityId;
  carBrandId: UniqueEntityId;
  carModelId: UniqueEntityId;
  carSubModelId: UniqueEntityId;

  plateNumber: PlateNumber;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class UserCar extends AggregateRoot<UserCarProps> {
  _user?: User;
  _car?: CarSubModel;

  private static schema = object<UserCarProps>({
    userId: object().required(),
    carBrandId: object().required(),
    carModelId: object().required(),
    carSubModelId: object().required(),

    plateNumber: object().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: UserCarProps, id?: UniqueEntityId) {
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

  get car(): CarSubModel | undefined {
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

  get plateNumber(): PlateNumber {
    return this.props.plateNumber;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  setUser(user: User): void {
    this._user = user;
  }

  setCar(car: CarSubModel): void {
    this._car = car;
  }

  public static create(props: UserCarProps, id?: UniqueEntityId): UserCar {
    const guardResult = Guard.against<UserCarProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("UserCar", guardResult.message);
    } else {
      return new UserCar(
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
