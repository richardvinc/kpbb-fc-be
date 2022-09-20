import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { JSONUserCarProps } from "@KPBBFC/user";

export type RetrieveUserCarListCommand = ICommandWithIdentity<
  RetrieveUserCarListDTO,
  ICommandIdentity
>;

export type RetrieveUserCarListPayload = JSONUserCarProps[];

export type RetrieveUserCarListDTO = {
  version?: number;
};

export const RetrieveUserCarListCommandSchema =
  object<RetrieveUserCarListCommand>({
    dto: object<RetrieveUserCarListDTO>({
      version: number().optional(),
    }).optional(),
    identity: object<ICommandIdentity>({
      id: string().required(),
    }),
  });
