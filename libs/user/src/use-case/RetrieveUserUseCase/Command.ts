import { number, object, string } from "joi";

import { ICommand } from "@KPBBFC/types";
import { JSONUserProps } from "@KPBBFC/user";

export type RetrieveUserCommand = ICommand<RetrieveUserDTO>;

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
      id: string().optional(),
      firebaseUid: string().optional(),
      username: string().optional(),
    }).required(),
  }).optional(),
});
