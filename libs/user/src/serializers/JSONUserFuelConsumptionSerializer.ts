/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { UserFuelConsumption } from "../domains";
import { JSONUserCarProps, JSONUserCarSerializer } from "./";

export interface JSONUserFuelConsumptionProps {
  id: string;
  userId: string;
  km_traveled: number;
  fuel_filled: number;
  average: number;
  filledAt: string;

  userCar?: JSONUserCarProps;
  createdAt?: string;
  updatedAt?: string;
}

@StaticImplements<
  Serializer<UserFuelConsumption, JSONUserFuelConsumptionProps>
>()
export class JSONUserFuelConsumptionSerializer {
  public static deserialize(): UserFuelConsumption {
    throw new Error("Method not implemented.");
  }

  public static serialize(
    domain: UserFuelConsumption
  ): JSONUserFuelConsumptionProps {
    return {
      id: domain.id.toString(),
      userId: domain.userId.toString(),
      km_traveled: domain.kmTravelled,
      fuel_filled: domain.fuelFilled,
      average: domain.average,
      filledAt: domain.filledAt.toISOString(),

      userCar: domain.car
        ? JSONUserCarSerializer.serialize(domain.car)
        : undefined,

      createdAt: domain.createdAt?.toISOString(),
      updatedAt: domain.updatedAt?.toISOString(),
    };
  }
}
