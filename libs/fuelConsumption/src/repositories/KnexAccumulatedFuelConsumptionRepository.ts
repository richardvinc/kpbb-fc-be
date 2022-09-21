import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { AccumulatedFuelConsumption } from "../domains";
import {
  PostgresAccumulatedFuelConsumptionMapper,
  PostgresAccumulatedFuelConsumptionProps,
} from "../mappers";
import {
  GetAccumulatedFuelConsumptionSelection,
  GetAllAccumulatedFuelConsumptionSelection,
  IAccumulatedFuelConsumptionRepository,
} from "./IAccumulatedFuelConsumptionRepository";

interface Cradle {
  knexClient: Knex;
}

export class KnexAccumulatedFuelConsumptionRepository
  extends KnexBaseRepository<PostgresAccumulatedFuelConsumptionProps>
  implements IAccumulatedFuelConsumptionRepository
{
  TABLE_NAME = "accumulated_fuel_consumption";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexAccumulatedFuelConsumptionRepository");
  }
  async get(
    options?: GetAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: AccumulatedFuelConsumption | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.carBrandId) {
          qb.orWhere({ car_brand_id: options.selection.carBrandId.toString() });
        }
        if (options?.selection?.carModelId) {
          qb.orWhere({ car_model_id: options.selection.carModelId.toString() });
        }
        if (options?.selection?.carSubModelId) {
          qb.orWhere({
            car_sub_model_id: options.selection.carSubModelId.toString(),
          });
        }
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) car = PostgresAccumulatedFuelConsumptionMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption[]> {
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
        if (options?.selection?.carBrandIds) {
          qb.whereIn(
            "car_brand_id",
            options.selection.carBrandIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.carModelIds) {
          qb.whereIn(
            "car_model_id",
            options.selection.carModelIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.carSubModelIds) {
          qb.whereIn(
            "car_sub_model_id",
            options.selection.carSubModelIds.map((id) => id.toString())
          );
        }

        if (options?.limit) {
          qb.limit(options.limit);
          if (options.page) qb.offset(options.limit * (options.page - 1));
        }

        qb.whereNull(`deleted_at`);
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const cars = rows.map(PostgresAccumulatedFuelConsumptionMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<number> {
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
        if (options?.selection?.carBrandIds) {
          qb.whereIn(
            "car_brand_id",
            options.selection.carBrandIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.carModelIds) {
          qb.whereIn(
            "car_model_id",
            options.selection.carModelIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.carSubModelIds) {
          qb.whereIn(
            "car_sub_model_id",
            options.selection.carSubModelIds.map((id) => id.toString())
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
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { fc, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresAccumulatedFuelConsumptionMapper.toPersistence(fc))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    fc: AccumulatedFuelConsumption,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { fc, options } });

    const { car_sub_model_id, ...props } =
      PostgresAccumulatedFuelConsumptionMapper.toPersistence(fc);

    const query = this.client(this.TABLE_NAME)
      .where("car_sub_model_id", car_sub_model_id)
      .update(props)
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }
}
