import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { AccumulatedFuelConsumption } from "../domains";

export enum AccumulatedFuelConsumptionOrderFields {
  CREATED_AT = "created_at",
  AVERAGE = "average",
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
    search?: string;
    carBrandIds?: UniqueEntityId[];
    carModelIds?: UniqueEntityId[];
    carSubModelIds?: UniqueEntityId[];
  };
  orderBy?: [AccumulatedFuelConsumptionOrderFields, OrderDirection];
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

  getTotalKmTravelled(carSubModelId: UniqueEntityId): Promise<number>;
  getTotalFuelFilled(carSubModelId: UniqueEntityId): Promise<number>;
  getTotalAverage(carSubModelId: UniqueEntityId): Promise<number>;
  getTotalCar(carSubModelId: UniqueEntityId): Promise<number>;

  persist(
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
  update(
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions
  ): Promise<void>;
}
