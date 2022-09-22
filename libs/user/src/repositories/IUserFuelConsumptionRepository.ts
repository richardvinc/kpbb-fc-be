import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { UserFuelConsumption } from "../domains";

export enum UserFuelConsumptionOrderFields {
  CREATED_AT = "CREATED_AT",
  FILLED_AT = "FILLED_AT",
}

export interface GetUserFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllUserFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  orderBy?: [UserFuelConsumptionOrderFields, OrderDirection];
  limit?: number;
  page?: number;
  selection?: {
    ids?: UniqueEntityId[];
    userIds?: UniqueEntityId[];
    userCarIds?: UniqueEntityId[];
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

  getLastEntry(): Promise<UserFuelConsumption | undefined>;

  persist(
    car: UserFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
  // update(
  //   car: UserFuelConsumption,
  //   options?: KnexBaseRepositoryOptions
  // ): Promise<void>;
}
