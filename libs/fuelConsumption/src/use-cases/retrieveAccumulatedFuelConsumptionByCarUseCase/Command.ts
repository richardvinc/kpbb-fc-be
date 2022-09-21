import { number, object, string } from "joi";

import { JSONAccumulatedFuelConsumptionProps } from "@KPBBFC/fuelConsumption/serializers";
import { ICommand } from "@KPBBFC/types";

export type RetrieveAccumulatedFuelConsumptionByCarCommand =
  ICommand<RetrieveAccumulatedFuelConsumptionByCarDTO>;

export type RetrieveAccumulatedFuelConsumptionByCarPayload =
  JSONAccumulatedFuelConsumptionProps;

export type RetrieveAccumulatedFuelConsumptionByCarDTO = {
  version?: number;

  carSubModelId: string;
};

export const RetrieveAccumulatedFuelConsumptionByCarCommandSchema =
  object<RetrieveAccumulatedFuelConsumptionByCarCommand>({
    dto: object<RetrieveAccumulatedFuelConsumptionByCarDTO>({
      version: number().optional(),

      carSubModelId: string().required(),
    }).optional(),
  });
