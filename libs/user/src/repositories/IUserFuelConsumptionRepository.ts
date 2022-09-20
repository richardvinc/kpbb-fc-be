import { UniqueEntityId } from "@KPBBFC/core";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { UserFuelConsumption } from "../domains";

export enum UserFuelConsumptionOrderFields {
  CREATED_AT,
}

export interface GetUserFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllUserFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    ids?: UniqueEntityId[];
  };
}

export interface IUserFuelConsumptionRepository {
  get(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined>;
  getAll(
    options?: GetAllUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption[]>;
  getCount(options?: GetAllUserFuelConsumptionSelection): Promise<number>;

  persist(
    car: UserFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
  update(
    car: UserFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
}
