import { number, object, string } from "joi";

import { JSONAccumulatedFuelConsumptionListProps } from "@KPBBFC/fuelConsumption/serializers";
import { ICommand } from "@KPBBFC/types";

export type RetrieveAccumulatedFuelConsumptionListCommand =
  ICommand<RetrieveAccumulatedFuelConsumptionListDTO>;

export type RetrieveAccumulatedFuelConsumptionListPayload =
  JSONAccumulatedFuelConsumptionListProps;

export type RetrieveAccumulatedFuelConsumptionListDTO = {
  version?: number;

  carBrandId?: string;
  carModelId?: string;
  carSubModelId?: string;
  search?: string;
  limit?: number;
  page?: number;
};

export const RetrieveAccumulatedFuelConsumptionListCommandSchema =
  object<RetrieveAccumulatedFuelConsumptionListCommand>({
    dto: object<RetrieveAccumulatedFuelConsumptionListDTO>({
      version: number().optional(),

      carBrandId: string().optional(),
      carModelId: string().optional(),
      carSubModelId: string().optional(),
      search: string().min(3).optional(),
      limit: number().optional(),
      page: number().optional(),
    }).optional(),
  });
