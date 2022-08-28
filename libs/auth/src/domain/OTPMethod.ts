import { string } from "joi";

import { Guard, InternalError, ValueObject } from "@kopeka/core";

export enum OTPMethodEnum {
  SMS = "SMS",
}

interface OTPMethodProps {
  value: string;
}

export class OTPMethod extends ValueObject<OTPMethodProps> {
  public static SCHEMA = string()
    .required()
    .valid(...Object.values(OTPMethodEnum));

  get value(): string {
    return this.props.value;
  }

  private constructor(props: OTPMethodProps) {
    super(props);
  }

  public static create(val: string): OTPMethod {
    const guardResult = Guard.against<OTPMethodProps>(this.SCHEMA, val);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("OTPMethod", guardResult.message);
    } else {
      return new OTPMethod({
        value: val,
      });
    }
  }
}
