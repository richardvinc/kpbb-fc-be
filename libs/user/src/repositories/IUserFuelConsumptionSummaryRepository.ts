import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { UserFuelConsumptionSummary } from "../domains";

export enum UserFuelConsumptionSummaryOrderFields {
  CREATED_AT = "CREATED_AT",
  FILLED_AT = "FILLED_AT",
}

export interface GetUserFuelConsumptionSummarySelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    userCarId: UniqueEntityId;
  };
}

export interface GetAllUserFuelConsumptionSummarySelection
  extends KnexBaseRepositoryOptions {
  orderBy?: [UserFuelConsumptionSummaryOrderFields, OrderDirection];
  limit?: number;
  selection?: {
    userIds?: UniqueEntityId[];
    userCarIds?: UniqueEntityId[];
    carBrandIds?: UniqueEntityId[];
    carModelIds?: UniqueEntityId[];
    carSubModelIds?: UniqueEntityId[];
  };
}

export interface IUserFuelConsumptionSummaryRepository {
  get(
    options?: GetUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary | undefined>;
  getAll(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary[]>;
  getCount(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<number>;

  persist(
    ufc: UserFuelConsumptionSummary,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
  update(
    ufc: UserFuelConsumptionSummary,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
}
