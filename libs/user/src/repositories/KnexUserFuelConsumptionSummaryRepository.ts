import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { UserFuelConsumptionSummary } from "../domains";
import {
  PostgresUserFuelConsumptionSummaryMapper,
  PostgresUserFuelConsumptionSummaryProps,
} from "../mappers";
import {
  GetAllUserFuelConsumptionSummarySelection,
  GetUserFuelConsumptionSummarySelection,
  IUserFuelConsumptionSummaryRepository,
  UserFuelConsumptionSummaryOrderFields,
} from "./IUserFuelConsumptionSummaryRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [UserFuelConsumptionSummaryOrderFields.CREATED_AT]: "created_at",
  [UserFuelConsumptionSummaryOrderFields.FILLED_AT]: "filled_at",
};
export class KnexUserFuelConsumptionSummaryRepository
  extends KnexBaseRepository<PostgresUserFuelConsumptionSummaryProps>
  implements IUserFuelConsumptionSummaryRepository
{
  TABLE_NAME = "user_fuel_consumption_summary";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexUserFuelConsumptionSummaryRepository");
  }
  async get(
    options?: GetUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let car: UserFuelConsumptionSummary | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.userCarId) {
          qb.orWhere({ user_car_id: options.selection.userCarId.toString() });
        }
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) car = PostgresUserFuelConsumptionSummaryMapper.toDomain(row);

    logger.trace(`END`);
    return car;
  }

  async getAll(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary[]> {
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
        if (options?.selection?.userCarIds) {
          qb.whereIn(
            "user_car_id",
            options.selection.userCarIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.userIds) {
          qb.whereIn(
            "user_id",
            options.selection.userIds.map((id) => id.toString())
          );
        }
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

        if (options?.orderBy) {
          qb.orderBy(
            orderFields[options.orderBy[0]],
            options.orderBy[1] === OrderDirection.ASC ? "asc" : "desc"
          );
        }
        if (options?.limit) {
          qb.limit(options.limit);
        }

        qb.whereNull(`deleted_at`);
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const cars = rows.map(PostgresUserFuelConsumptionSummaryMapper.toDomain);

    logger.trace(`END`);
    return cars;
  }

  async getCount(
    options?: GetAllUserFuelConsumptionSummarySelection
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
        if (options?.selection?.userCarIds) {
          qb.whereIn(
            "user_car_id",
            options.selection.userCarIds.map((id) => id.toString())
          );
        }
        if (options?.selection?.userIds) {
          qb.whereIn(
            "user_id",
            options.selection.userIds.map((id) => id.toString())
          );
        }
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
    ufc: UserFuelConsumptionSummary,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { ufc, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresUserFuelConsumptionSummaryMapper.toPersistence(ufc))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    ufc: UserFuelConsumptionSummary,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { ufc, options } });

    const { user_car_id, ...props } =
      PostgresUserFuelConsumptionSummaryMapper.toPersistence(ufc);

    const query = this.client(this.TABLE_NAME)
      .where("user_car_id", user_car_id)
      .update(props)
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }
}
