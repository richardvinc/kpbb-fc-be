import { number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@kopeka/types";
import { JSONUserProps } from "@kopeka/user/serializers/JSONUserSerializer";

import { Username } from "../../domains";

export type CreateUserCommand = ICommandWithIdentity<
  CreateUserDTO,
  ICommandIdentity
>;

export type CreateUserPayload = JSONUserProps;

export type CreateUserDTO = {
  version?: number;
  user: {
    username: string;
    firebaseUid: string;
  };
};

export const CreateUserCommandSchema = object<CreateUserCommand>({
  dto: object<CreateUserDTO>({
    version: number().optional(),
    user: object({
      username: Username.SCHEMA.required(),
      firebaseUid: string().required(),
    }),
  }).required(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
