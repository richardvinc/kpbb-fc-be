import { date, object } from "joi";

import { AggregateRoot, UniqueEntityId } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

import {
  CarBrand,
  CarDimension,
  CarModel,
  FuelType,
  TankCapacity,
  TransmissionType,
} from "./properties";

interface CarProps {
  brand: CarBrand;
  model: CarModel;
  fuelType: FuelType;

  transmissionType?: TransmissionType;
  tankCapacity?: TankCapacity;
  dimension?: CarDimension;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Car extends AggregateRoot<CarProps> {
  private static schema = object<CarProps>({
    brand: object().required(),
    model: object().required(),
    fuelType: object().required(),

    transmissionType: object().optional(),
    tankCapacity: object().optional(),
    dimension: object().optional(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: CarProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get printedName(): string {
    return `${this.brand.value} ${this.model.value} ${
      this.transmissionType?.value ?? ""
    }`.trim();
  }

  get brand(): CarBrand {
    return this.props.brand;
  }

  get model(): CarModel {
    return this.props.model;
  }

  get fuelType(): FuelType {
    return this.props.fuelType;
  }

  get transmissionType(): TransmissionType | undefined {
    return this.props.transmissionType;
  }

  get tankCapacity(): TankCapacity | undefined {
    return this.props.tankCapacity;
  }

  get dimension(): CarDimension | undefined {
    return this.props.dimension;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  setTransmissionType(transmissionType: TransmissionType): void {
    this.props.transmissionType = transmissionType;
  }

  setTankCapacity(tankCapacity: TankCapacity): void {
    this.props.tankCapacity = tankCapacity;
  }

  setDimension(dimension: CarDimension): void {
    this.props.dimension = dimension;
  }

  public static create(props: CarProps, id?: UniqueEntityId): Car {
    const guardResult = Guard.against<CarProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("Car", guardResult.message);
    } else {
      return new Car(
        {
          ...props,
        },
        id
      );
    }
  }
}
