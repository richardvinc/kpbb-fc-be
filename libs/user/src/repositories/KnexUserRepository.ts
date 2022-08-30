import Knex from "knex";

import { getCurrentHub } from "@kopeka/core";
import { OrderDirection } from "@kopeka/db/repository/BaseRepository";
import {
  KnexBaseRepository,
  KnexBaseRepositoryOptions,
} from "@kopeka/db/repository/knex";

import { User } from "../domains";
import {
  PostgresUserMapper,
  PostgresUserProps,
} from "../mappers/PostgresUserMapper";
import {
  GetAllUserSelection,
  GetUserSelection,
  IUserRepository,
  UserOrderFields,
} from "./IUserRepository";

interface Cradle {
  knexClient: Knex;
}

const orderFields = {
  [UserOrderFields.CREATED_AT]: "created_at",
};

export class KnexUserRepository
  extends KnexBaseRepository<PostgresUserProps>
  implements IUserRepository
{
  TABLE_NAME = "users";

  constructor(cradle: Cradle) {
    super(cradle.knexClient, "KnexUserRepository");
  }
  async get(options?: GetUserSelection): Promise<User | undefined> {
    const logger = this.logger.child({
      method: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    let user: User | undefined;

    const query = this.client(this.TABLE_NAME)
      .select()
      .modify((qb) => {
        // filters
        if (options?.selection?.id) {
          qb.orWhere({ id: options.selection.id.toString() });
        }
        if (options?.selection?.firebaseUid) {
          qb.orWhere({ firebase_uid: options.selection.firebaseUid });
        }
        // if (options?.selection?.phoneNumber) {
        //   qb.where({ phone_number: options.selection.phoneNumber.value });
        // }
        if (options?.selection?.username) {
          qb.where({ username: options.selection.username.value });
        }
      })
      .first();

    logger.info({ query: query.toQuery() });

    const row = await query;

    if (row) user = PostgresUserMapper.toDomain(row);

    logger.trace(`END`);
    return user;
  }

  async getAll(options?: GetAllUserSelection): Promise<User[]> {
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
        if (options?.selection?.firebaseUids) {
          qb.whereIn(
            "id",
            options.selection.firebaseUids.map((id) => id)
          );
        }
        // if (options?.selection?.phoneNumbers) {
        //   qb.whereIn(
        //     "phone_number",
        //     options.selection.phoneNumbers.map(
        //       (phoneNumber) => phoneNumber.value
        //     )
        //   );
        // }
        if (options?.selection?.usernames) {
          qb.whereIn(
            "username",
            options.selection.usernames.map((username) => username.value)
          );
        }
        if (options?.selection?.dateFrom) {
          qb.where("created_at", ">=", options.selection.dateFrom);
        }
        if (options?.selection?.dateUntil) {
          qb.where("created_at", "<=", options.selection.dateUntil);
        }

        // pagination
        if (options?.after && options?.orderBy) {
          const [field, direction] = options.orderBy;
          const operator = direction === OrderDirection.DESC ? "<" : ">";
          const whereRaw = options.after.composite
            ? `(??, ??) ${operator} (?, ?)`
            : `?? ${operator} ?`;
          const bindings = options.after.composite
            ? [
                orderFields[field],
                "id",
                options.after.composite,
                options.after.id.toString(),
              ]
            : ["id", options.after.id.toString()];

          qb.whereRaw(whereRaw, bindings);
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

        // default to not return deleted users
        qb.whereNull("deleted_at");
      });

    logger.info({ query: query.toQuery() });

    const rows = await query;
    const users = rows.map(PostgresUserMapper.toDomain);

    logger.trace(`END`);
    return users;
  }

  async getCount(options?: GetAllUserSelection): Promise<number> {
    const logger = this.logger.child({
      method: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { options } });

    const query = this.client(this.TABLE_NAME)
      .count("*")
      .modify((qb) => {
        // filters
        if (options?.selection?.ids) {
          qb.whereIn(
            "id",
            options.selection.ids.map((id) => id.toString())
          );
        }
        if (options?.selection?.firebaseUids) {
          qb.whereIn(
            "id",
            options.selection.firebaseUids.map((id) => id)
          );
        }
        // if (options?.selection?.phoneNumbers) {
        //   qb.whereIn(
        //     "phone_number",
        //     options.selection.phoneNumbers.map(
        //       (phoneNumber) => phoneNumber.value
        //     )
        //   );
        // }
        if (options?.selection?.usernames) {
          qb.whereIn(
            "username",
            options.selection.usernames.map((username) => username.value)
          );
        }
        if (options?.selection?.dateFrom) {
          qb.where("created_at", ">=", options.selection.dateFrom);
        }
        if (options?.selection?.dateUntil) {
          qb.where("created_at", "<=", options.selection.dateUntil);
        }

        // default to not return deleted users
        qb.whereNull("deleted_at");
      })
      .first();

    logger.info({ query: query.toQuery() });

    const rows = await query;

    logger.trace(`END`);
    return rows["count(*)"];
  }

  async persist(
    user: User,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { user, options } });

    const query = this.client(this.TABLE_NAME)
      .insert(PostgresUserMapper.toPersistence(user))
      .modify((qb) => {
        if (options?.transaction) qb.transacting(options.transaction);
      });

    logger.info({ query: query.toQuery() });

    await query;

    logger.trace(`END`);
  }

  async update(
    user: User,
    options?: KnexBaseRepositoryOptions | undefined
  ): Promise<void> {
    const logger = this.logger.child({
      method: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);
    logger.debug({ args: { user, options } });

    const { id, ...props } = PostgresUserMapper.toPersistence(user);

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
