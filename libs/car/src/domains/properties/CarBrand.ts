import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface CarBrandProps {
  value: string;
}

export class CarBrand extends ValueObject<CarBrandProps> {
  public static SCHEMA = string().required().min(4).max(50);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CarBrandProps) {
    super(props);
  }

  public static create(value: string): CarBrand {
    const guardResult = Guard.against<CarBrandProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarBrand", guardResult.message);
    } else {
      return new CarBrand({ value });
    }
  }
}
