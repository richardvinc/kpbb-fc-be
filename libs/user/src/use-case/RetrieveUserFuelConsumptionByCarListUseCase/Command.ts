import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { JSONUserFuelConsumptionHistoryProps } from "@KPBBFC/user";

export type RetrieveUserFuelConsumptionListByCarCommand = ICommandWithIdentity<
  RetrieveUserFuelConsumptionListByCarDTO,
  ICommandIdentity
>;

export type RetrieveUserFuelConsumptionListByCarPayload =
  JSONUserFuelConsumptionHistoryProps;

export type RetrieveUserFuelConsumptionListByCarDTO = {
  version?: number;
  carId: string;
  limit?: number;
  page?: number;
};

export const RetrieveUserFuelConsumptionListByCarCommandSchema =
  object<RetrieveUserFuelConsumptionListByCarCommand>({
    dto: object<RetrieveUserFuelConsumptionListByCarDTO>({
      version: number().optional(),
      carId: string().required(),
      limit: number().optional(),
      page: number().optional(),
    }).optional(),
    identity: object<ICommandIdentity>({
      id: string().required(),
    }),
  });
