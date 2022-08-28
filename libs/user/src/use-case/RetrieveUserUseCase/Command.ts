import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@kopeka/types";

import { User, Username } from "../../domains";

export type RetrieveUserCommand = ICommandWithIdentity<
  RetrieveUserDTO,
  ICommandIdentity
>;

export type RetrieveUserPayload = User;

export type RetrieveUserDTO = {
  version?: number;
  by?: {
    id?: string;
    username?: string;
  };
};

export const RetrieveUserCommandSchema = object<RetrieveUserCommand>({
  dto: object<RetrieveUserDTO>({
    version: number().optional(),
    by: object({
      id: string().uuid().optional(),
      username: Username.SCHEMA.optional(),
    }).xor("id", "username"),
  }).optional(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
