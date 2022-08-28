import { string } from "joi";
import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  public static SCHEMA = string().email().required();

  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string | undefined): Email {
    const guardResult = Guard.against<string>(this.SCHEMA, email);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("Email", guardResult.message);
    } else {
      return new Email({ value: guardResult.value });
    }
  }
}
