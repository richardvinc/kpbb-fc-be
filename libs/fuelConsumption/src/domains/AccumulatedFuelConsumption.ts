import { date, number, object } from "joi";

import { CarSubModel } from "@KPBBFC/car";
import { UniqueEntityId, ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface AccumulatedFuelConsumptionProps {
  carBrandId: UniqueEntityId;
  carModelId: UniqueEntityId;
  carSubModelId: UniqueEntityId;

  totalCar: number;
  totalKmTravelled: number;
  totalFuelFilled: number;
  average: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class AccumulatedFuelConsumption extends ValueObject<AccumulatedFuelConsumptionProps> {
  _car?: CarSubModel;

  public static SCHEMA = object({
    carBrandId: object().required(),
    carModelId: object().required(),
    carSubModelId: object().required(),

    totalCar: number().required(),
    totalKmTravelled: number().required(),
    totalFuelFilled: number().required(),
    average: number().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  get carBrandId(): UniqueEntityId {
    return this.props.carBrandId;
  }

  get carModelId(): UniqueEntityId {
    return this.props.carModelId;
  }

  get carSubModelId(): UniqueEntityId {
    return this.props.carSubModelId;
  }

  get car(): CarSubModel | undefined {
    return this._car;
  }

  get totalCar(): number {
    return this.props.totalCar;
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

  public setCar(car: CarSubModel): void {
    this._car = car;
  }

  private constructor(props: AccumulatedFuelConsumptionProps) {
    super(props);
  }

  public static create(
    value: AccumulatedFuelConsumptionProps
  ): AccumulatedFuelConsumption {
    const guardResult = Guard.against<AccumulatedFuelConsumptionProps>(
      this.SCHEMA,
      value
    );

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "AccumulatedFuelConsumption",
        guardResult.message
      );
    } else {
      return new AccumulatedFuelConsumption(value);
    }
  }
}
