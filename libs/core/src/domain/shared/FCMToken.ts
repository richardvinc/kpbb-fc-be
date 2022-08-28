import { string } from "joi";

import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface FCMTokenProps {
  value: string;
}

export class FCMToken extends ValueObject<FCMTokenProps> {
  public static SCHEMA = string().required();

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FCMTokenProps) {
    super(props);
  }

  public static create(token: string): FCMToken {
    const guardResult = Guard.against<FCMTokenProps>(this.SCHEMA, token);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("FCMToken", guardResult.message);
    } else {
      return new FCMToken({
        value: token,
      });
    }
  }
}
