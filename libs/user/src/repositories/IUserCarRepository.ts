import { UniqueEntityId } from "@KPBBFC/core";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { UserCar } from "../domains";

export enum UserCarOrderFields {
  CREATED_AT,
}

export interface GetUserCarSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
  };
}

export interface GetAllUserCarSelection extends KnexBaseRepositoryOptions {
  selection?: {
    ids?: UniqueEntityId[];
  };
}

export interface IUserCarRepository {
  get(options?: GetUserCarSelection): Promise<UserCar | undefined>;
  getAll(options?: GetAllUserCarSelection): Promise<UserCar[]>;
  getCount(options?: GetAllUserCarSelection): Promise<number>;

  persist(car: UserCar, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(car: UserCar, options?: KnexBaseRepositoryOptions): Promise<void>;
}
