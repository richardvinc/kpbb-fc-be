import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  public static SCHEMA = string().required().min(4).max(50);

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
