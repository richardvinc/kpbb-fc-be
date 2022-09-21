/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JSONCarSubModelProps, JSONCarSubModelSerializer } from "@KPBBFC/car";
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { AccumulatedFuelConsumption } from "../domains";

export interface JSONAccumulatedFuelConsumptionProps {
  totalKmTraveled: number;
  totalFuelFilled: number;
  average: number;

  car?: JSONCarSubModelProps;
  statistic?: number;
}

@StaticImplements<
  Serializer<AccumulatedFuelConsumption, JSONAccumulatedFuelConsumptionProps>
>()
export class JSONAccumulatedFuelConsumptionSerializer {
  public static deserialize(): AccumulatedFuelConsumption {
    throw new Error("Method not implemented.");
  }

  public static serialize(
    domain: AccumulatedFuelConsumption
  ): JSONAccumulatedFuelConsumptionProps {
    return {
      totalKmTraveled: domain.totalKmTravelled,
      totalFuelFilled: domain.totalFuelFilled,
      average: domain.average,

      car: domain.car
        ? JSONCarSubModelSerializer.serialize(domain.car)
        : undefined,
    };
  }
}
