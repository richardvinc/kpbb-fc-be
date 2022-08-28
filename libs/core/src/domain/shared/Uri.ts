import { string } from "joi";

import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export interface UriProps {
  value: string;
}

export class Uri extends ValueObject<UriProps> {
  public static SCHEMA = string().uri();

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UriProps) {
    super(props);
  }

  public static create(url: string): Uri {
    const guardResult = Guard.against<UriProps>(this.SCHEMA, url);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("URL", guardResult.message);
    } else {
      return new Uri({
        value: url,
      });
    }
  }
}
