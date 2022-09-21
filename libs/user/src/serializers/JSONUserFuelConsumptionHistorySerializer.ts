/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Serializer, StaticImplements } from "@KPBBFC/core";
import {
  JSONFuelConsumptionProps,
  JSONFuelConsumptionSerializer,
} from "@KPBBFC/fuelConsumption";

import { UserFuelConsumptionHistory } from "../domains";
import {
  JSONUserCarProps,
  JSONUserCarSerializer,
  JSONUserProps,
  JSONUserSerializer,
} from "./";

export interface JSONUserFuelConsumptionHistoryProps {
  user: JSONUserProps;
  car: JSONUserCarProps;
  fuelConsumptions: JSONFuelConsumptionProps[];
}

@StaticImplements<
  Serializer<UserFuelConsumptionHistory, JSONUserFuelConsumptionHistoryProps>
>()
export class JSONUserFuelConsumptionHistorySerializer {
  public static deserialize(): UserFuelConsumptionHistory {
    throw new Error("Method not implemented.");
  }

  public static serialize(
    domain: UserFuelConsumptionHistory
  ): JSONUserFuelConsumptionHistoryProps {
    return {
      user: JSONUserSerializer.serialize(domain.user),
      car: JSONUserCarSerializer.serialize(domain.car),
      fuelConsumptions: domain.fuelConsumptions.map((fc) =>
        JSONFuelConsumptionSerializer.serialize(fc)
      ),
    };
  }
}
