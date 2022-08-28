import { string } from "joi";

import { Guard, InternalError, ValueObject } from "@kopeka/core";

export interface OTPProps {
  value: string;
}

export class OTP extends ValueObject<OTPProps> {
  public static SCHEMA = string().required().length(6);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: OTPProps) {
    super(props);
  }

  public static create(code: string): OTP {
    const guardResult = Guard.against<OTPProps>(this.SCHEMA, code);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("OTP", guardResult.message);
    } else {
      return new OTP({
        value: code,
      });
    }
  }
}
