import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { CarBrand } from "../domains";
import { PostgresCarBrandMapper, PostgresCarBrandProps } from "../mappers";
import {
  GetAllCarBrandSelection,
  GetCarBrandSelection,
  ICarBrandRepository,
} from "./ICarBrandRepository";

interface Cradle {
  knexClient: Knex;
}

export class KnexCarBrandRepository
  extends KnexBaseRepository<PostgresCarBrandProps>
  implements ICarBrandRepository
{
  TABLE_NAME = "car_brands";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexCarBrandRepository");
  }
  async get(options?: GetCarBrandSelection): Promise<CarBrand | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: CarBrand | undefined;

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

    if (row) car = PostgresCarBrandMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(options?: GetAllCarBrandSelection): Promise<CarBrand[]> {
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

        if (options?.search) {
          qb.whereRaw(`printed_name like '?'`, `%${options.search}%`);
        }

        qb.whereNull(`deleted_at`);
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const cars = rows.map(PostgresCarBrandMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(options?: GetAllCarBrandSelection): Promise<number> {
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

        if (options?.search) {
          qb.whereRaw(`printed_name like '?'`, `%${options.search}%`);
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
    car: CarBrand,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresCarBrandMapper.toPersistence(car))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    car: CarBrand,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const { id, ...props } = PostgresCarBrandMapper.toPersistence(car);

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
