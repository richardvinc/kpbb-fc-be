import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface CarModelProps {
  value: string;
}

export class CarModel extends ValueObject<CarModelProps> {
  public static SCHEMA = string().required().min(4).max(100);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CarModelProps) {
    super(props);
  }

  public static create(value: string): CarModel {
    const guardResult = Guard.against<CarModelProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarModel", guardResult.message);
    } else {
      return new CarModel({ value });
    }
  }
}
