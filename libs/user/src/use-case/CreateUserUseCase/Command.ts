import { number, object, string } from "joi";

import { ICommand } from "@KPBBFC/types";
import { JSONUserProps } from "@KPBBFC/user";

import { Username } from "../../domains";

export type CreateUserCommand = ICommand<CreateUserDTO>;

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
});
