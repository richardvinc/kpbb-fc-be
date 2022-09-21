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
};

export const RetrieveUserFuelConsumptionListByCarCommandSchema =
  object<RetrieveUserFuelConsumptionListByCarCommand>({
    dto: object<RetrieveUserFuelConsumptionListByCarDTO>({
      version: number().optional(),
      carId: string().required(),
    }).optional(),
    identity: object<ICommandIdentity>({
      id: string().required(),
    }),
  });
