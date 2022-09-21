/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { UserFuelConsumptionSummary } from "../domains";
import {
  JSONUserCarProps,
  JSONUserCarSerializer,
  JSONUserProps,
  JSONUserSerializer,
} from "./";

export interface JSONUserFuelConsumptionSummaryProps {
  user?: JSONUserProps;
  car?: JSONUserCarProps;

  totalKmTravelled: number;
  totalFuelFilled: number;
  average: number;
}

@StaticImplements<
  Serializer<UserFuelConsumptionSummary, JSONUserFuelConsumptionSummaryProps>
>()
export class JSONUserFuelConsumptionSummarySerializer {
  public static deserialize(): UserFuelConsumptionSummary {
    throw new Error("Method not implemented.");
  }

  public static serialize(
    domain: UserFuelConsumptionSummary
  ): JSONUserFuelConsumptionSummaryProps {
    console.log(domain.car);
    return {
      user: domain.user ? JSONUserSerializer.serialize(domain.user) : undefined,
      car: domain.car ? JSONUserCarSerializer.serialize(domain.car) : undefined,

      totalKmTravelled: domain.totalKmTravelled,
      totalFuelFilled: domain.totalFuelFilled,
      average: domain.average,
    };
  }
}
