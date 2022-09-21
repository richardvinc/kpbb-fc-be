import { UniqueEntityId } from "@KPBBFC/core";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { AccumulatedFuelConsumption } from "../domains";

export enum AccumulatedFuelConsumptionOrderFields {
  CREATED_AT,
}

export interface GetAccumulatedFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    carBrandId?: UniqueEntityId;
    carModelId?: UniqueEntityId;
    carSubModelId?: UniqueEntityId;
  };
}

export interface GetAllAccumulatedFuelConsumptionSelection
  extends KnexBaseRepositoryOptions {
  selection?: {
    carBrandIds?: UniqueEntityId[];
    carModelIds?: UniqueEntityId[];
    carSubModelIds?: UniqueEntityId[];
  };
  limit?: number;
  page?: number;
}

export interface IAccumulatedFuelConsumptionRepository {
  get(
    options?: GetAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption | undefined>;
  getAll(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption[]>;
  getCount(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<number>;

  persist(
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
  update(
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
}
