import { string } from "joi";

import { ValueObject } from "@kopeka/core/domain";
import { InternalError } from "@kopeka/core/errors";
import { Guard } from "@kopeka/core/logic";

export interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  public static SCHEMA = string()
    .required()
    .min(4)
    .max(30)
    .regex(/[a-z0-9._]{4,15}$/);

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UsernameProps) {
    super(props);
  }

  public static create(value: string): Username {
    const guardResult = Guard.against<UsernameProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("Username", guardResult.message);
    } else {
      return new Username({ value });
    }
  }
}
