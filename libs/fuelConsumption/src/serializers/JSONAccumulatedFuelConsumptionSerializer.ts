/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JSONCarSubModelProps, JSONCarSubModelSerializer } from "@KPBBFC/car";
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { AccumulatedFuelConsumption } from "../domains";

export interface JSONAccumulatedFuelConsumptionProps {
  totalCar: number;
  totalKmTraveled: number;
  totalFuelFilled: number;
  average: number;

  car?: JSONCarSubModelProps;
  statistic?: number;
}

export interface JSONAccumulatedFuelConsumptionListProps {
  data: JSONAccumulatedFuelConsumptionProps[];
  totalEntries: number;
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
      totalCar: domain.totalCar,
      totalKmTraveled: domain.totalKmTravelled,
      totalFuelFilled: domain.totalFuelFilled,
      average: domain.average,

      car: domain.car
        ? JSONCarSubModelSerializer.serialize(domain.car)
        : undefined,
    };
  }

  public static serializeList(
    domain: AccumulatedFuelConsumption[],
    totalEntries: number
  ): JSONAccumulatedFuelConsumptionListProps {
    return {
      data: domain.map((item) =>
        JSONAccumulatedFuelConsumptionSerializer.serialize(item)
      ),
      totalEntries,
    };
  }
}
