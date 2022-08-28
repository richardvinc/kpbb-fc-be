import { string } from "joi";
import { InternalError } from "../../errors";
import { Guard } from "../../logic";
import { ValueObject } from "../ValueObject";

export enum TimeUnitEnum {
  MIN5 = "MIN5",
  MIN15 = "MIN15",
  HOUR1 = "HOUR1",
  DAY1 = "DAY1",
  CUSTOM = "CUSTOM",
}

interface TimeUnitProps {
  value: string;
}

export class TimeUnit extends ValueObject<TimeUnitProps> {
  public static SCHEMA = string()
    .required()
    .valid(...Object.values(TimeUnitEnum));

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TimeUnitProps) {
    super(props);
  }

  public static create(val: string): TimeUnit {
    const guardResult = Guard.against<TimeUnitProps>(this.SCHEMA, val);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError("TimeUnit", guardResult.message);
    } else {
      return new TimeUnit({
        value: val,
      });
    }
  }
}
