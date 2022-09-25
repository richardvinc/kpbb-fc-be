import { array, number, object, string } from "joi";

import { TransmissionTypeEnum } from "@KPBBFC/car/domains";
import { JSONCarSubModelProps } from "@KPBBFC/car/serializers";
import { ICommand } from "@KPBBFC/types";

export type RetrieveCarListCommand = ICommand<RetrieveCarListDTO>;

export type RetrieveCarListPayload = JSONCarSubModelProps[];

export type RetrieveCarListDTO = {
  version?: number;
  filter?: {
    search?: string;
    transmission?: string;
    carBrandIds?: string[];
    carModelIds?: string[];
    limit?: number;
    page?: number;
  };
};

export const RetrieveCarListCommandSchema = object<RetrieveCarListCommand>({
  dto: object<RetrieveCarListDTO>({
    version: number().optional(),
    filter: object({
      search: string().min(2).optional(),
      transmission: string()
        .valid(...Object.values(TransmissionTypeEnum))
        .optional(),
      carBrandIds: array().items(string().uuid()).optional(),
      carModelIds: array().items(string().uuid()).optional(),
      limit: number().optional(),
      page: number().optional(),
    }).optional(),
  }).optional(),
});
