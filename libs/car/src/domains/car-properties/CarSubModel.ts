import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface CarSubModelProps {
  value: string;
}

export class CarSubModel extends ValueObject<CarSubModelProps> {
  public static SCHEMA = string().required().min(4).max(100);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CarSubModelProps) {
    super(props);
  }

  public static create(value: string): CarSubModel {
    const guardResult = Guard.against<CarSubModelProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("CarSubModel", guardResult.message);
    } else {
      return new CarSubModel({ value });
    }
  }
}
