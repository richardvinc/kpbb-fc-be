import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { UserCar } from "../domains";
import {
  GetAllUserCarSelection,
  GetUserCarSelection,
  IUserCarRepository,
} from "../repositories/IUserCarRepository";
import { IUserCarService } from "./";

interface Cradle {
  knexClient: Knex;

  userCarRepository: IUserCarRepository;
}

export class UserCarService extends BaseService implements IUserCarService {
  private userCarRepository: IUserCarRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("UserCarService");

    this.knexClient = cradle.knexClient;
    this.userCarRepository = cradle.userCarRepository;
  }

  async get(options?: GetUserCarSelection): Promise<UserCar | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userCarRepository.get(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(options?: GetAllUserCarSelection): Promise<UserCar[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userCarRepository.getAll(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(options?: GetAllUserCarSelection): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userCarRepository.getCount(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async createUserCar(UserCar: UserCar): Promise<void> {
    const logger = this.logger.child({
      methodName: "createUserCar",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { UserCar } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userCarRepository.persist(UserCar, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  // async updateUserCar(UserCar: UserCar): Promise<void> {
  //   const logger = this.logger.child({
  //     methodName: "updateUserCar",
  //     traceId: getCurrentHub().getTraceId(),
  //   });

  //   logger.trace("BEGIN");
  //   logger.debug({ args: { UserCar } });

  //   const transaction = await this.knexClient.transaction();

  //   try {
  //     await this.userCarRepository.update(UserCar, { transaction });

  //     transaction.commit();
  //   } catch (error) {
  //     logger.fatal(error as Error);
  //     transaction.rollback();
  //     throw error;
  //   }
  // }
}
