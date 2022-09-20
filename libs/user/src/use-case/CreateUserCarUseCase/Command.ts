import { number, object, string } from "joi";

import { PlateNumber } from "@KPBBFC/car";
import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";

import { JSONUserCarProps } from "../../serializers";

export type CreateUserCarCommand = ICommandWithIdentity<
  CreateUserCarDTO,
  ICommandIdentity
>;

export type CreateUserCarPayload = JSONUserCarProps;

export type CreateUserCarDTO = {
  version?: number;
  car: {
    carSubModelId: string;
    plateNumber: string;
  };
};

export const CreateUserCarCommandSchema = object<CreateUserCarCommand>({
  dto: object<CreateUserCarDTO>({
    version: number().optional(),
    car: object({
      carSubModelId: string().required(),
      plateNumber: PlateNumber.SCHEMA.required(),
    }),
  }).required(),
  identity: object<ICommandIdentity>({
    id: string().required(),
  }),
});
