import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@kopeka/types";

import { User, Username } from "../../domains";

export type CreateUserCommand = ICommandWithIdentity<
  CreateUserDTO,
  ICommandIdentity
>;

export type CreateUserPayload = User;

export type CreateUserDTO = {
  version?: number;
  user: {
    username: string;
  };
};

export const CreateUserCommandSchema = object<CreateUserCommand>({
  dto: object<CreateUserDTO>({
    version: number().optional(),
    user: object({
      username: Username.SCHEMA.required(),
    }),
  }).required(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
