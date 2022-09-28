import { date, number, object } from "joi";

import { ValueObject } from "@KPBBFC/core/domain";
import { InternalError } from "@KPBBFC/core/errors";
import { Guard } from "@KPBBFC/core/logic";

export interface FuelConsumptionProps {
  kmTravelled: number;
  fuelFilled: number;
  average: number;
  filledAt: Date;
}

export class FuelConsumption extends ValueObject<FuelConsumptionProps> {
  public static SCHEMA = object({
    kmTravelled: number().required().min(0),
    fuelFilled: number().required().min(0),
    average: number().required().min(0),
    filledAt: date().required(),
  }).required();

  get kmTravelled(): number {
    return this.props.kmTravelled;
  }

  get fuelFilled(): number {
    return this.props.fuelFilled;
  }

  get average(): number {
    return this.props.average;
  }

  get filledAt(): Date {
    return this.props.filledAt;
  }

  static calculateAverage(
    fuelFilled: number,
    kmTravelled: number,
    kmTravelledPrevious: number | undefined
  ): number {
    if (!kmTravelledPrevious) return 0;

    return (kmTravelled - kmTravelledPrevious) / fuelFilled;
  }

  private constructor(props: FuelConsumptionProps) {
    super(props);
  }

  public static create(value: FuelConsumptionProps): FuelConsumption {
    const guardResult = Guard.against<FuelConsumptionProps>(this.SCHEMA, value);

    if (!guardResult.succeeded) {
      throw new InternalError.DomainError(
        "FuelConsumption",
        guardResult.message
      );
    } else {
      return new FuelConsumption(value);
    }
  }
}
