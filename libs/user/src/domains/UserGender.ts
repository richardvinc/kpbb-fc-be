import { string } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface UserGenderProps {
  value: "M" | "F";
}

export class UserGender extends ValueObject<UserGenderProps> {
  public static SCHEMA = string().required().valid("M", "F");

  get value(): "M" | "F" {
    return this.props.value;
  }

  private constructor(props: UserGenderProps) {
    super(props);
  }

  public static create(value: "M" | "F"): UserGender {
    const guardResult = Guard.against<UserGenderProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("UserGender", guardResult.message);
    } else {
      return new UserGender({ value });
    }
  }
}
