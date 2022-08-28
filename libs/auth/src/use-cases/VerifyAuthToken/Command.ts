import { number, object, string } from "joi";

import { ICommand } from "@kopeka/types";

export type VerifyAuthTokenCommand = ICommand<VerifyAuthTokenDTO>;

export type VerifyAuthTokenPayload = string | undefined;

export type VerifyAuthTokenDTO = {
  version?: number;
  token: string;
};

export const VerifyAuthTokenCommandSchema = object<VerifyAuthTokenCommand>({
  dto: object<VerifyAuthTokenDTO>({
    version: number().optional(),
    token: string().required(),
  }).required(),
});
