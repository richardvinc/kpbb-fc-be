import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { Car } from "../domains";
import {
  PostgresCarMapper,
  PostgresCarProps,
} from "../mappers/PostgresCarMapper";
import {
  CarOrderFields,
  GetAllCarSelection,
  GetCarSelection,
  ICarRepository,
} from "./ICarRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [CarOrderFields.CREATED_AT]: "created_at",
};

export class KnexCarRepository
  extends KnexBaseRepository<PostgresCarProps>
  implements ICarRepository
{
  TABLE_NAME = "cars";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexCarRepository");
  }
  async get(options?: GetCarSelection): Promise<Car | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: Car | undefined;

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

    if (row) car = PostgresCarMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(options?: GetAllCarSelection): Promise<Car[]> {
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
        if (options?.selection?.brands) {
          qb.whereIn(
            "brand",
            options.selection.brands.map((brand) => brand.value)
          );
        }
        if (options?.selection?.models) {
          qb.whereIn(
            "model",
            options.selection.models.map((model) => model.value)
          );
        }
        if (options?.selection?.fuelTypes) {
          qb.whereIn(
            "fuel_type",
            options.selection.fuelTypes.map((fuelType) => fuelType.value)
          );
        }
        if (options?.selection?.transmissionType) {
          qb.where(
            "transmission_type",
            options.selection.transmissionType.value
          );
        }

        if (options?.search) {
          qb.whereRaw(`brand like '?'`, `%${options.search}%`);
          qb.orWhereRaw(`model like '?'`, `%${options.search}%`);
        }

        if (options?.selection?.dateFrom) {
          qb.where("created_at", ">=", options.selection.dateFrom);
        }
        if (options?.selection?.dateUntil) {
          qb.where("created_at", "<=", options.selection.dateUntil);
        }

        // order by
        if (options?.orderBy) {
          qb.orderBy(
            orderFields[options.orderBy[0]],
            options.orderBy[1] === OrderDirection.ASC ? "asc" : "desc"
          );
        }

        // pagination
        if (options?.limit) {
          qb.limit(options.limit);
          if (options.page) qb.offset(options.limit * (options.page - 1));
        }
        qb.whereNull(`deleted_at`);
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const cars = rows.map(PostgresCarMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(options?: GetAllCarSelection): Promise<number> {
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
        if (options?.selection?.brands) {
          qb.whereIn(
            "brand",
            options.selection.brands.map((brand) => brand.value)
          );
        }
        if (options?.selection?.models) {
          qb.whereIn(
            "model",
            options.selection.models.map((model) => model.value)
          );
        }
        if (options?.selection?.fuelTypes) {
          qb.whereIn(
            "fuel_type",
            options.selection.fuelTypes.map((fuelType) => fuelType.value)
          );
        }
        if (options?.selection?.transmissionType) {
          qb.where(
            "transmission_type",
            options.selection.transmissionType.value
          );
        }

        if (options?.search) {
          qb.whereRaw(`brand like '?'`, `%${options.search}%`);
          qb.orWhereRaw(`model like '?'`, `%${options.search}%`);
        }

        if (options?.selection?.dateFrom) {
          qb.where("created_at", ">=", options.selection.dateFrom);
        }
        if (options?.selection?.dateUntil) {
          qb.where("created_at", "<=", options.selection.dateUntil);
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
    car: Car,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresCarMapper.toPersistence(car))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    car: Car,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const { id, ...props } = PostgresCarMapper.toPersistence(car);

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
