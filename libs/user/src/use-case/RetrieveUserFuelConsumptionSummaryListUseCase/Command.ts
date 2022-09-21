import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { JSONUserFuelConsumptionSummaryProps } from "@KPBBFC/user";

export type RetrieveUserFuelConsumptionSummaryListCommand =
  ICommandWithIdentity<
    RetrieveUserFuelConsumptionSummaryListDTO,
    ICommandIdentity
  >;

export type RetrieveUserFuelConsumptionSummaryListPayload =
  JSONUserFuelConsumptionSummaryProps[];

export type RetrieveUserFuelConsumptionSummaryListDTO = {
  version?: number;
  carId?: string;
};

export const RetrieveUserFuelConsumptionSummaryListCommandSchema =
  object<RetrieveUserFuelConsumptionSummaryListCommand>({
    dto: object<RetrieveUserFuelConsumptionSummaryListDTO>({
      version: number().optional(),
      carId: string().optional(),
    }).optional(),
    identity: object<ICommandIdentity>({
      id: string().required(),
    }),
  });
