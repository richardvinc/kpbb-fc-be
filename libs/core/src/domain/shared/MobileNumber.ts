import { string } from "joi";

import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface MobileNumberProps {
  value: string;
}

export class MobileNumber extends ValueObject<MobileNumberProps> {
  public static SCHEMA = string()
    .required()
    .regex(/^628\d{8,12}$/);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: MobileNumberProps) {
    super(props);
  }

  public static create(mobileNumber: string): MobileNumber {
    const guardResult = Guard.against<MobileNumberProps>(
      this.SCHEMA,
      mobileNumber
    );

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("MobileNumber", guardResult.message);
    } else {
      return new MobileNumber({
        value: mobileNumber,
      });
    }
  }
}
