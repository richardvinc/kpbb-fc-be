import Knex from "knex";

import { getCurrentHub } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@KPBBFC/db/repository/knex";

import { UserFuelConsumption } from "../domains";
import {
  PostgresUserFuelConsumptionMapper,
  PostgresUserFuelConsumptionProps,
} from "../mappers";
import {
  GetAllUserFuelConsumptionSelection,
  GetUserFuelConsumptionSelection,
  IUserFuelConsumptionRepository,
  UserFuelConsumptionOrderFields,
} from "./IUserFuelConsumptionRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [UserFuelConsumptionOrderFields.CREATED_AT]: "created_at",
  [UserFuelConsumptionOrderFields.FILLED_AT]: "filled_at",
};
export class KnexUserFuelConsumptionRepository
  extends KnexBaseRepository<PostgresUserFuelConsumptionProps>
  implements IUserFuelConsumptionRepository
{
  TABLE_NAME = "user_fuel_consumption";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexUserFuelConsumptionRepository");
  }
  async get(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let ufc: UserFuelConsumption | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.id) {
          qb.orWhere({ id: options.selection.id.toString() });
        }
        if (options?.selection?.userId) {
          qb.orWhere({ user_id: options.selection.userId.toString() });
        }
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) ufc = PostgresUserFuelConsumptionMapper.toDomain(row);

    logger.trace(`END`);
    return ufc;
  }

  async getLastEntry(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined> {
    const logger = this.logger.child({
      method: "getLastEntries",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    let ufc: UserFuelConsumption | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.id) {
          qb.andWhere({ id: options.selection.id.toString() });
        }
        if (options?.selection?.userId) {
          qb.andWhere({ user_id: options.selection.userId.toString() });
        }
      })
      .orderBy("filled_at", "desc")
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) ufc = PostgresUserFuelConsumptionMapper.toDomain(row);

    logger.trace(`END`);
    return ufc;
  }

  async getAll(
    options?: GetAllUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption[]> {
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

        if (options?.orderBy) {
          qb.orderBy(
            orderFields[options.orderBy[0]],
            options.orderBy[1] === OrderDirection.ASC ? "asc" : "desc"
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
    const ufcs = rows.map(PostgresUserFuelConsumptionMapper.toDomain);

    logger.trace(`END`);
    return ufcs;
  }

  async getCount(
    options?: GetAllUserFuelConsumptionSelection
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
        if (options?.selection?.ids) {
          qb.whereIn(
            "id",
            options.selection.ids.map((id) => id.toString())
          );
        }
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
    car: UserFuelConsumption,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { car, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresUserFuelConsumptionMapper.toPersistence(car))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  // async update(
  //   car: UserFuelConsumption,
  //   options?: KnexBaseRepositoryOptions | undefined
  // ): Promise<void> {
  //   const logger = this.logger.child({
  //     method: "update",
  //     traceId: getCurrentHub().getTraceId(),
  //   });

  //   logger.trace(`BEGIN`);
  //   logger.debug({ args: { car, options } });

  //   const { id, ...props } =
  //     PostgresUserFuelConsumptionMapper.toPersistence(car);

  //   const query = this.client(this.TABLE_NAME)
  //     .where("id", id)
  //     .update(props)
  //     .modify((qb) => {
  //       if (options?.transaction) qb.transacting(options.transaction);
  //     });

  //   logger.info({ query: query.toQuery() });

  //   await query;

  //   logger.trace(`END`);
  // }
}
