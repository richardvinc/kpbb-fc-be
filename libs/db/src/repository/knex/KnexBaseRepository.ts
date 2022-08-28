import Knex from "knex";
import { BaseRepository } from "../BaseRepository";

export interface KnexBaseRepositoryOptions {
  transaction?: Knex.Transaction;
}

export abstract class KnexBaseRepository<TRecord> extends BaseRepository {
  protected client: Knex<TRecord, TRecord[]>;

  protected abstract TABLE_NAME: string;

  constructor(client: Knex<TRecord, TRecord[]>, name: string) {
    super(name);
    this.client = client;
  }
}
