import { boolean, number, object } from "joi";

import { JSONAccumulatedFuelConsumptionProps } from "@KPBBFC/fuelConsumption/serializers";
import { ICommand } from "@KPBBFC/types";

export type RetrieveTop10AccumulatedFuelConsumptionListCommand =
  ICommand<RetrieveTop10AccumulatedFuelConsumptionListDTO>;

export type RetrieveTop10AccumulatedFuelConsumptionListPayload =
  JSONAccumulatedFuelConsumptionProps[];

export type RetrieveTop10AccumulatedFuelConsumptionListDTO = {
  version?: number;
  isCar?: boolean;
};

export const RetrieveTop10AccumulatedFuelConsumptionListCommandSchema =
  object<RetrieveTop10AccumulatedFuelConsumptionListCommand>({
    dto: object<RetrieveTop10AccumulatedFuelConsumptionListDTO>({
      version: number().optional(),
      isCar: boolean().optional(),
    }).optional(),
  });
