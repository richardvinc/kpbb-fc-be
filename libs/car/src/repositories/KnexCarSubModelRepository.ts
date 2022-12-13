import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { CarSubModel } from "../domains";
import {
  PostgresCarSubModelMapper,
  PostgresCarSubModelProps,
} from "../mappers";
import {
  CarSubModelOrderFields,
  GetAllCarSubModelSelection,
  GetCarSubModelSelection,
  ICarSubModelRepository,
} from "./ICarSubModelRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [CarSubModelOrderFields.CREATED_AT]: "created_at",
};

export class KnexCarSubModelRepository
  extends KnexBaseRepository<PostgresCarSubModelProps>
  implements ICarSubModelRepository
{
  TABLE_NAME = "car_sub_models";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexCarSubModelRepository");
  }
  async get(
    options?: GetCarSubModelSelection
  ): Promise<CarSubModel | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: CarSubModel | undefined;

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

    if (row) car = PostgresCarSubModelMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(options?: GetAllCarSubModelSelection): Promise<CarSubModel[]> {
    const logger = this.logger.child({
      method: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        if (options?.isCar !== undefined) {
          qb.where({ is_car: options.isCar });
        }
        // filters
        if (options?.selection?.ids) {
          qb.whereIn(
            "id",
            options.selection.ids.map((id) => id.toString())
          );
        }
        if (options?.selection?.brandIds) {
          qb.whereIn(
            "car_brand_id",
            options.selection.brandIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.modelIds) {
          qb.whereIn(
            "car_model_id",
            options.selection.modelIds.map((id) => id.toString())
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
          qb.whereRaw(
            `lower(printed_name) like ?`,
            `%${options.search.toLowerCase()}%`
          );
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
        } else {
          qb.orderBy("printed_name", "asc");
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
    const cars = rows.map(PostgresCarSubModelMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(options?: GetAllCarSubModelSelection): Promise<number> {
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
        if (options?.selection?.brandIds) {
          qb.whereIn(
            "car_brand_id",
            options.selection.brandIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.modelIds) {
          qb.whereIn(
            "car_model_id",
            options.selection.modelIds.map((id) => id.toString())
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
          qb.whereRaw(
            `lower(printed_name) like ?`,
            `%${options.search.toLowerCase()}%`
          );
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
    car: CarSubModel,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresCarSubModelMapper.toPersistence(car))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    car: CarSubModel,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const { id, ...props } = PostgresCarSubModelMapper.toPersistence(car);

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
