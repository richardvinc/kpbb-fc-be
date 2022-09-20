import { date, object, string } from "joi";

import { AggregateRoot, UniqueEntityId } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

import { CarBrand } from "./";

interface CarModelProps {
  name: string;

  carBrandId: UniqueEntityId;
  brand?: CarBrand;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class CarModel extends AggregateRoot<CarModelProps> {
  private static schema = object<CarModelProps>({
    name: string().required(),

    carBrandId: object().required(),
    brand: object().optional(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().optional().allow(null),
  }).required();

  private constructor(props: CarModelProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get carBrandId(): UniqueEntityId {
    return this.props.carBrandId;
  }

  get brand(): CarBrand | undefined {
    return this.props.brand;
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

  setBrand(carBrand: CarBrand): void {
    this.props.brand = carBrand;
  }

  public static create(props: CarModelProps, id?: UniqueEntityId): CarModel {
    const guardResult = Guard.against<CarModelProps>(this.schema, props);
    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarModel", guardResult.message);
    } else {
      return new CarModel(
        {
          ...props,
        },
        id
      );
    }
  }
}
