import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export enum FuelTypeEnum {
  GAS = "GAS",
  HYBRID = "HYBRID",
  ELECTRIC = "ELECTRIC",
  DIESEL = "DIESEL",
}

export interface FuelTypeProps {
  value: string;
}

export class FuelType extends ValueObject<FuelTypeProps> {
  public static SCHEMA = string()
    .required()
    .valid(...Object.values(FuelTypeEnum));

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FuelTypeProps) {
    super(props);
  }

  public static create(value: string): FuelType {
    const guardResult = Guard.against<FuelTypeProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("FuelType", guardResult.message);
    } else {
      return new FuelType({ value });
    }
  }
}
