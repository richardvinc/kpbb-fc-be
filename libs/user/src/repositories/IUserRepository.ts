import { UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { KnexBaseRepositoryOptions } from "@KPBBFC/db/repository/knex";

import { User, Username } from "../domains";

export enum UserOrderFields {
  CREATED_AT,
}

export interface GetUserSelection extends KnexBaseRepositoryOptions {
  selection?: {
    id?: UniqueEntityId;
    firebaseUid?: string;
    // phoneNumber?: MobileNumber;
    username?: Username;
  };
}

export interface GetAllUserSelection extends KnexBaseRepositoryOptions {
  limit?: number;
  orderBy?: [UserOrderFields, OrderDirection];
  after?: {
    id: UniqueEntityId;
    composite?: string;
  };

  selection?: {
    ids?: UniqueEntityId[];
    firebaseUids?: string[];
    // phoneNumbers?: MobileNumber[];
    usernames?: Username[];
    dateFrom?: Date;
    dateUntil?: Date;
  };

  exclude?: {
    ids?: UniqueEntityId[];
    firebaseUids?: string[];
    // phoneNumbers?: string[];
    usernames?: string[];
  };
}

export interface IUserRepository {
  get(options?: GetUserSelection): Promise<User | undefined>;
  getAll(options?: GetAllUserSelection): Promise<User[]>;
  getCount(options?: GetAllUserSelection): Promise<number>;

  persist(user: User, options?: KnexBaseRepositoryOptions): Promise<void>;
  update(user: User, options?: KnexBaseRepositoryOptions): Promise<void>;
}
