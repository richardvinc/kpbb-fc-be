import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { CarSubModel, FuelType, TransmissionType } from "../domains";

export enum CarSubModelOrderFields {
  CREATED_AT,
}

export interface GetCarSubModelSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllCarSubModelSelection extends KnexBaseRepositoryOptions {
  limit?: number;
  page?: number;
  orderBy?: [CarSubModelOrderFields, OrderDirection];
  isCar?: boolean;
  search?: string;

  selection?: {
    ids?: UniqueEntityId[];
    brandIds?: UniqueEntityId[];
    modelIds?: UniqueEntityId[];
    fuelTypes?: FuelType[];
    transmissionType?: TransmissionType;

    dateFrom?: Date;
    dateUntil?: Date;
  };
}

export interface ICarSubModelRepository {
  get(options?: GetCarSubModelSelection): Promise<CarSubModel | undefined>;
  getAll(options?: GetAllCarSubModelSelection): Promise<CarSubModel[]>;
  getCount(options?: GetAllCarSubModelSelection): Promise<number>;

  persist(car: CarSubModel, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(car: CarSubModel, options?: KnexBaseRepositoryOptions): Promise<void>;
}
