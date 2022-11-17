import Knex from "knex";

import { getCurrentHub, UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
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
  AccumulatedFuelConsumptionOrderFields,
  GetAccumulatedFuelConsumptionSelection,
  GetAllAccumulatedFuelConsumptionSelection,
  IAccumulatedFuelConsumptionRepository,
} from "./IAccumulatedFuelConsumptionRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [AccumulatedFuelConsumptionOrderFields.CREATED_AT]: "created_at",
  [AccumulatedFuelConsumptionOrderFields.AVERAGE]: "average",
};
export class KnexAccumulatedFuelConsumptionRepository
  extends KnexBaseRepository<PostgresAccumulatedFuelConsumptionProps>
  implements IAccumulatedFuelConsumptionRepository
{
  TABLE_NAME = "accumulated_fuel_consumption";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexAccumulatedFuelConsumptionRepository");
  }

  async getTotalKmTravelled(carSubModelId: UniqueEntityId): Promise<number> {
    const logger = this.logger.child({
      method: "getTotalKm",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { carSubModelId } });

    const query = this.client("user_fuel_consumption_summary")
      .sum("total_km_travelled as sum")
      .where("car_sub_model_id", carSubModelId.toString())
      .first();

    logger.info({ query: query.toQuery() });

    // row can be null if there is no data
    const row = (await query) as unknown as { sum: string };

    logger.debug({ row });

    logger.trace(`END`);
    return row ? +row.sum : 0;
  }

  async getTotalFuelFilled(carSubModelId: UniqueEntityId): Promise<number> {
    const logger = this.logger.child({
      method: "getTotalFuelFilled",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { carSubModelId } });

    const query = this.client("user_fuel_consumption_summary")
      .sum("total_fuel_filled as sum")
      .where("car_sub_model_id", carSubModelId.toString())
      .first();

    logger.info({ query: query.toQuery() });

    const row = (await query) as unknown as { sum: string };

    logger.debug({ row });

    logger.trace(`END`);
    return row ? +row.sum : 0;
  }

  async getTotalAverage(carSubModelId: UniqueEntityId): Promise<number> {
    const logger = this.logger.child({
      method: "getTotalAverage",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { carSubModelId } });

    const query = this.client("user_fuel_consumption_summary")
      .avg("average as avg")
      .where("car_sub_model_id", carSubModelId.toString())
      .where("average", ">", 0)
      .first();

    logger.info({ query: query.toQuery() });

    const row = (await query) as unknown as { avg: string };

    logger.debug({ row });

    logger.trace(`END`);
    return row ? +row.avg : 0;
  }

  async getTotalCar(carSubModelId: UniqueEntityId): Promise<number> {
    const logger = this.logger.child({
      method: "getTotalCar",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { carSubModelId } });

    const query = this.client("user_fuel_consumption_summary")
      .count("* as count")
      .where("car_sub_model_id", carSubModelId.toString())
      .first();

    logger.info({ query: query.toQuery() });

    const row = (await query) as unknown as { count: string };

    logger.debug({ row });

    logger.trace(`END`);
    return row ? +row.count : 0;
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

    const query = this.getAccumulatedFuelConsumptionWithCarName()
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

    const query = this.getAccumulatedFuelConsumptionWithCarName().modify(
      (qb) => {
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
        if (options?.selection?.search) {
          qb.whereRaw(`lower(printed_name) LIKE ?`, [
            `%${options.selection.search.toLowerCase()}%`,
          ]);
        }

        if (options?.top10) {
          qb.where("average", ">", 0);
        }

        if (options?.limit) {
          qb.limit(options.limit);
          if (options.page) qb.offset(options.limit * (options.page - 1));
        }

        if (options?.orderBy) {
          qb.orderBy(
            orderFields[options.orderBy[0]],
            options.orderBy[1] === OrderDirection.ASC ? "asc" : "desc"
          );
        }

        qb.whereNull(`${this.TABLE_NAME}.deleted_at`);
      }
    );

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

    const query = this.getCountAccumulatedFuelConsumptionWithCarName()
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
        if (options?.selection?.search) {
          qb.whereRaw(`lower(printed_name) LIKE ?`, [
            `%${options.selection.search.toLowerCase()}%`,
          ]);
          qb.groupBy("printed_name");
        }

        // default to not return deleted entries
        qb.whereNull(`${this.TABLE_NAME}.deleted_at`);
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = (await query) as unknown as { count: string };

    logger.trace(`END`);
    return row ? +row.count : 0;
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

    const { car_sub_model_id, created_at, ...props } =
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

  private getAccumulatedFuelConsumptionWithCarName() {
    return this.client(this.TABLE_NAME)
      .select(`${this.TABLE_NAME}.*`, `car_sub_models.printed_name`)
      .leftJoin(`car_sub_models`, `id`, `car_sub_model_id`);
  }

  private getCountAccumulatedFuelConsumptionWithCarName() {
    return this.client(this.TABLE_NAME)
      .count(`* as count`)
      .leftJoin(`car_sub_models`, `id`, `car_sub_model_id`);
  }
}
