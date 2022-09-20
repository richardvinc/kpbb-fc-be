import { UniqueEntityId } from "@KPBBFC/core";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { CarBrand } from "../domains";

export enum CarBrandOrderFields {
  CREATED_AT,
}

export interface GetCarBrandSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllCarBrandSelection extends KnexBaseRepositoryOptions {
  search?: string;

  selection?: {
    ids?: UniqueEntityId[];
  };
}

export interface ICarBrandRepository {
  get(options?: GetCarBrandSelection): Promise<CarBrand | undefined>;
  getAll(options?: GetAllCarBrandSelection): Promise<CarBrand[]>;
  getCount(options?: GetAllCarBrandSelection): Promise<number>;

  persist(car: CarBrand, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(car: CarBrand, options?: KnexBaseRepositoryOptions): Promise<void>;
}
