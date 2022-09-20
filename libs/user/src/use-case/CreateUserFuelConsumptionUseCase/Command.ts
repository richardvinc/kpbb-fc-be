import { date, number, object, string } from "joi";

import { ICommandIdentity, ICommandWithIdentity } from "@KPBBFC/types";

import { JSONUserFuelConsumptionProps } from "../../serializers";

export type CreateUserFuelConsumptionCommand = ICommandWithIdentity<
  CreateUserFuelConsumptionDTO,
  ICommandIdentity
>;

export type CreateUserFuelConsumptionPayload = JSONUserFuelConsumptionProps;

export type CreateUserFuelConsumptionDTO = {
  version?: number;
  fuelConsumption: {
    carId: string;
    kmTravelled: number;
    fuelFilled: number;
    filledAt: Date;
  };
};

export const CreateUserFuelConsumptionCommandSchema =
  object<CreateUserFuelConsumptionCommand>({
    dto: object<CreateUserFuelConsumptionDTO>({
      version: number().optional(),
      fuelConsumption: object({
        carId: string().required(),
        kmTravelled: number().required(),
        fuelFilled: number().required(),
        filledAt: date().required(),
      }),
    }).required(),
    identity: object<ICommandIdentity>({
      id: string().required(),
    }),
  });
