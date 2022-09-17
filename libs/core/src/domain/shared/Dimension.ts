import { number } from "joi";

import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface DimensionProps {
  value: number;
}

export class Dimension extends ValueObject<DimensionProps> {
  public static SCHEMA = number().min(0).required();

  get value(): number {
    return this.props.value;
  }

  private constructor(props: DimensionProps) {
    super(props);
  }

  public static create(name: number): Dimension {
    const guardResult = Guard.against<number>(this.SCHEMA, name);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("Dimension", guardResult.message);
    } else {
      return new Dimension({ value: guardResult.value });
    }
  }
}
