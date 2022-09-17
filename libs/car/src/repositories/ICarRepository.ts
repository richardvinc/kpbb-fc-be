import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import {
  Car,
  CarBrand,
  CarModel,
  FuelType,
  TransmissionType,
} from "../domains";

export enum CarOrderFields {
  CREATED_AT,
}

export interface GetCarSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllCarSelection extends KnexBaseRepositoryOptions {
  limit?: number;
  page?: number;
  orderBy?: [CarOrderFields, OrderDirection];

  search?: string;

  selection?: {
    ids?: UniqueEntityId[];
    brands?: CarBrand[];
    models?: CarModel[];
    fuelTypes?: FuelType[];
    transmissionType?: TransmissionType;

    dateFrom?: Date;
    dateUntil?: Date;
  };

  exclude?: {
    ids?: UniqueEntityId[];
    brands?: CarBrand[];
    models?: CarModel[];
  };
}

export interface ICarRepository {
  get(options?: GetCarSelection): Promise<Car | undefined>;
  getAll(options?: GetAllCarSelection): Promise<Car[]>;
  getCount(options?: GetAllCarSelection): Promise<number>;

  persist(car: Car, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(car: Car, options?: KnexBaseRepositoryOptions): Promise<void>;
}
