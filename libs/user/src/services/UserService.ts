import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { User } from "../domains";
import {
  GetAllUserSelection,
  GetUserSelection,
  IUserRepository,
} from "../repositories/IUserRepository";
import { IUserService } from "./IUserService";

interface Cradle {
  knexClient: Knex;

  userRepository: IUserRepository;
}

export class UserService extends BaseService implements IUserService {
  private userRepository: IUserRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("UserService");

    this.knexClient = cradle.knexClient;
    this.userRepository = cradle.userRepository;
  }

  async get(options?: GetUserSelection): Promise<User | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userRepository.get(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(options?: GetAllUserSelection): Promise<User[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userRepository.getAll(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(options?: GetAllUserSelection): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userRepository.getCount(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async createUser(user: User): Promise<void> {
    const logger = this.logger.child({
      methodName: "createUser",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { user } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userRepository.persist(user, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    const logger = this.logger.child({
      methodName: "updateUser",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { user } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userRepository.update(user, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }
}
