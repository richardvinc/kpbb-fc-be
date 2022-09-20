import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { UserCar } from "../domains";
import { PostgresUserCarMapper, PostgresUserCarProps } from "../mappers";
import {
  GetAllUserCarSelection,
  GetUserCarSelection,
  IUserCarRepository,
} from "./IUserCarRepository";

interface Cradle {
  knexClient: Knex;
}

export class KnexUserCarRepository
  extends KnexBaseRepository<PostgresUserCarProps>
  implements IUserCarRepository
{
  TABLE_NAME = "user_car";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexUserCarRepository");
  }
  async get(options?: GetUserCarSelection): Promise<UserCar | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: UserCar | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.id) {
          qb.orWhere({ id: options.selection.id.toString() });
        }
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) car = PostgresUserCarMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(options?: GetAllUserCarSelection): Promise<UserCar[]> {
    const logger = this.logger.child({
      method: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.ids) {
          qb.whereIn(
            "id",
            options.selection.ids.map((id) => id.toString())
          );
        }

        qb.whereNull(`deleted_at`);
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const cars = rows.map(PostgresUserCarMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(options?: GetAllUserCarSelection): Promise<number> {
    const logger = this.logger.child({
      method: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    const query = this.client(this.TABLE_NAME)
      .count("* as count")
      .modify((qb) => {
        // filters
        if (options?.selection?.ids) {
          qb.whereIn(
            "id",
            options.selection.ids.map((id) => id.toString())
          );
        }

        // default to not return deleted Cars
        qb.whereNull("deleted_at");
      })
      .first();

    logger.info({ query: query.toQuery() });

    const rows: { count: number | PromiseLike<number> } = await query;

    logger.trace(`END`);
    return rows.count;
  }

  async persist(
    car: UserCar,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresUserCarMapper.toPersistence(car))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    car: UserCar,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const { id, ...props } = PostgresUserCarMapper.toPersistence(car);

    const query = this.client(this.TABLE_NAME)
      .where("id", id)
      .update(props)
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }
}
