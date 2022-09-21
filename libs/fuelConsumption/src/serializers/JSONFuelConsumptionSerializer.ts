/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { FuelConsumption } from "../domains";

export interface JSONFuelConsumptionProps {
  kmTraveled: number;
  fuelFilled: number;
  average: number;
  filledAt: string;
}

@StaticImplements<Serializer<FuelConsumption, JSONFuelConsumptionProps>>()
export class JSONFuelConsumptionSerializer {
  public static deserialize(): FuelConsumption {
    throw new Error("Method not implemented.");
  }

  public static serialize(domain: FuelConsumption): JSONFuelConsumptionProps {
    return {
      kmTraveled: domain.kmTravelled,
      fuelFilled: domain.fuelFilled,
      average: domain.average,
      filledAt: domain.filledAt.toISOString(),
    };
  }
}
