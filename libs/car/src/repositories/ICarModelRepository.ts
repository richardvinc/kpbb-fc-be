import { UniqueEntityId } from "@KPBBFC/core";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { CarModel } from "../domains";

export enum CarModelOrderFields {
  CREATED_AT,
}

export interface GetCarModelSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllCarModelSelection extends KnexBaseRepositoryOptions {
  search?: string;

  selection?: {
    ids?: UniqueEntityId[];
  };
}

export interface ICarModelRepository {
  get(options?: GetCarModelSelection): Promise<CarModel | undefined>;
  getAll(options?: GetAllCarModelSelection): Promise<CarModel[]>;
  getCount(options?: GetAllCarModelSelection): Promise<number>;

  persist(car: CarModel, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(car: CarModel, options?: KnexBaseRepositoryOptions): Promise<void>;
}
