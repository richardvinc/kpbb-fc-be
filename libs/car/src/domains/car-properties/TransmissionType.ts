import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export enum TransmissionTypeEnum {
  AUTOMATIC = "AT",
  MANUAL = "MT",
  CONTINOUS_VARIABLE_TRANSMISSION = "CVT",
}

export interface TransmissionTypeProps {
  value: string;
}

export class TransmissionType extends ValueObject<TransmissionTypeProps> {
  public static SCHEMA = string()
    .required()
    .valid(...Object.values(TransmissionTypeEnum));

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TransmissionTypeProps) {
    super(props);
  }

  public static create(value: string): TransmissionType {
    const guardResult = Guard.against<TransmissionTypeProps>(
      this.SCHEMA,
      value
    );

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "TransmissionType",
        guardResult.message
      );
    } else {
      return new TransmissionType({ value });
    }
  }
}
