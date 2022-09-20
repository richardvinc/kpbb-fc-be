import { number } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface TankCapacityProps {
  value: number;
}

export class TankCapacity extends ValueObject<TankCapacityProps> {
  public static SCHEMA = number().required().min(0);

  get value(): number {
    return this.props.value;
  }

  private constructor(props: TankCapacityProps) {
    super(props);
  }

  public static create(value: number): TankCapacity {
    const guardResult = Guard.against<TankCapacityProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("TankCapacity", guardResult.message);
    } else {
      return new TankCapacity({ value });
    }
  }
}
