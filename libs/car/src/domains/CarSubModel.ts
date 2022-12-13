import { boolean, date, object, string } from "joi";

import { AggregateRoot, UniqueEntityId } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

import { CarBrand, CarModel } from "./";
import {
  CarDimension,
  FuelType,
  TankCapacity,
  TransmissionType,
} from "./car-properties";

interface CarSubModelProps {
  name: string;
  printedName: string;

  brandId: UniqueEntityId;
  brand?: CarBrand;

  modelId: UniqueEntityId;
  model?: CarModel;

  fuelType: FuelType;
  transmissionType: TransmissionType;
  tankCapacity?: TankCapacity;
  dimension?: CarDimension;

  isCar: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class CarSubModel extends AggregateRoot<CarSubModelProps> {
  private static schema = object<CarSubModelProps>({
    name: string().required(),
    printedName: string().required(),

    brandId: object().required(),
    brand: object().optional(),

    modelId: object().required(),
    model: object().optional(),

    fuelType: object().required(),
    transmissionType: object().required(),
    tankCapacity: object().optional(),
    dimension: object().optional(),

    isCar: boolean().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: CarSubModelProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get printedName(): string {
    return this.props.printedName;
  }

  get brandId(): UniqueEntityId {
    return this.props.brandId;
  }

  get brand(): CarBrand | undefined {
    return this.props.brand;
  }

  get modelId(): UniqueEntityId {
    return this.props.modelId;
  }

  get model(): CarModel | undefined {
    return this.props.model;
  }

  get isCar(): boolean {
    return this.props.isCar;
  }

  get fuelType(): FuelType {
    return this.props.fuelType;
  }

  get transmissionType(): TransmissionType {
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

  setBrand(brand: CarBrand): void {
    this.props.brand = brand;
  }

  setModel(model: CarModel): void {
    this.props.model = model;
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

  public static create(
    props: CarSubModelProps,
    id?: UniqueEntityId
  ): CarSubModel {
    const guardResult = Guard.against<CarSubModelProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarSubModel", guardResult.message);
    } else {
      return new CarSubModel(
        {
          ...props,
        },
        id
      );
    }
  }
}
