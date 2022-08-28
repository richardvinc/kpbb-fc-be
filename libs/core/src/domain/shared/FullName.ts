import { string } from "joi";
import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface FullNameProps {
  value: string;
}

export class FullName extends ValueObject<FullNameProps> {
  public static SCHEMA = string().min(1).max(64).required();

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FullNameProps) {
    super(props);
  }

  public static create(name: string): FullName {
    const guardResult = Guard.against<string>(this.SCHEMA, name);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("FullName", guardResult.message);
    } else {
      return new FullName({ value: guardResult.value });
    }
  }
}
