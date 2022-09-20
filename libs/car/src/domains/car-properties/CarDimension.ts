import { object } from "joi";

import { Dimension, ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface CarDimensionProps {
  length: Dimension; // panjang
  width: Dimension; // lebar
  height: Dimension; // tinggi
}

export class CarDimension extends ValueObject<CarDimensionProps> {
  public static SCHEMA = object({
    length: object().optional(),
    width: object().optional(),
    height: object().optional(),
  }).required();

  get length(): Dimension {
    return this.props.length;
  }

  get width(): Dimension {
    return this.props.width;
  }

  get height(): Dimension {
    return this.props.height;
  }

  private constructor(props: CarDimensionProps) {
    super(props);
  }

  public static create(value: CarDimensionProps): CarDimension {
    const guardResult = Guard.against<CarDimensionProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarDimension", guardResult.message);
    } else {
      return new CarDimension(value);
    }
  }
}
