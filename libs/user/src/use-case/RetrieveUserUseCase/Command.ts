import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";
import { JSONUserProps } from "@KPBBFC/user";

import { Username } from "../../domains";

export type RetrieveUserCommand = ICommandWithIdentity<
  RetrieveUserDTO,
  ICommandIdentity
>;

export type RetrieveUserPayload = JSONUserProps;

export type RetrieveUserDTO = {
  version?: number;
  by?: {
    id?: string;
    firebaseUid?: string;
    username?: string;
  };
};

export const RetrieveUserCommandSchema = object<RetrieveUserCommand>({
  dto: object<RetrieveUserDTO>({
    version: number().optional(),
    by: object({
      id: string().uuid().optional(),
      firebaseUid: string().optional(),
      username: Username.SCHEMA.optional(),
    }).xor("id", "username", "firebaseUid"),
  }).optional(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
