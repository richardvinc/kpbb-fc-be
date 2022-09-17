import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { JSONUserProps } from "@KPBBFC/user";

export type RetrieveUserListCommand = ICommandWithIdentity<
  RetrieveUserListDTO,
  ICommandIdentity
>;

export type RetrieveUserListPayload = JSONUserProps[];

export type RetrieveUserListDTO = {
  version?: number;
};

export const RetrieveUserListCommandSchema = object<RetrieveUserListCommand>({
  dto: object<RetrieveUserListDTO>({
    version: number().optional(),
  }).optional(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
