import { array, number, object, string } from "joi";

import { JSONCarSubModelProps } from "@KPBBFC/car/serializers";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";

export type RetrieveCarListCommand = ICommandWithIdentity<
  RetrieveCarListDTO,
  ICommandIdentity
>;

export type RetrieveCarListPayload = JSONCarSubModelProps[];

export type RetrieveCarListDTO = {
  version?: number;
  by?: {
    search?: string;
  };
  filter?: {
    carBrandIds?: string[];
    carModelIds?: string[];
    limit?: number;
    page?: number;
  };
};

export const RetrieveCarListCommandSchema = object<RetrieveCarListCommand>({
  dto: object<RetrieveCarListDTO>({
    version: number().optional(),
    by: object({
      search: string().min(2).optional(),
    }).optional(),
    filter: object({
      carBrandIds: array().items(string().uuid()).optional(),
      carModelIds: array().items(string().uuid()).optional(),
      limit: number().optional(),
      page: number().optional(),
    }).optional(),
  }).optional(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
