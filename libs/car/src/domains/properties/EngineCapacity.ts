import { number } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface EngineCapacityProps {
  value: number;
}

export class EngineCapacity extends ValueObject<EngineCapacityProps> {
  public static SCHEMA = number().required().min(0);

  get value(): number {
    return this.props.value;
  }

  private constructor(props: EngineCapacityProps) {
    super(props);
  }

  public static create(value: number): EngineCapacity {
    const guardResult = Guard.against<EngineCapacityProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "EngineCapacity",
        guardResult.message
      );
    } else {
      return new EngineCapacity({ value });
    }
  }
}
