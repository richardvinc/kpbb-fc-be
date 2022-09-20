import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface PlateNumberProps {
  value: string;
}

export class PlateNumber extends ValueObject<PlateNumberProps> {
  public static SCHEMA = string().required().min(4).max(100);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PlateNumberProps) {
    super(props);
  }

  public static create(value: string): PlateNumber {
    const guardResult = Guard.against<PlateNumberProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("PlateNumber", guardResult.message);
    } else {
      return new PlateNumber({ value });
    }
  }
}
