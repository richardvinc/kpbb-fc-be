import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { UserFuelConsumptionSummary } from "../domains";
import { IUserCarRepository as IUserCarService } from "../repositories";
import {
  GetAllUserFuelConsumptionSummarySelection,
  GetUserFuelConsumptionSummarySelection,
  IUserFuelConsumptionSummaryRepository,
} from "../repositories/IUserFuelConsumptionSummaryRepository";
import { IUserFuelConsumptionSummaryService } from "./";

interface Cradle {
  knexClient: Knex;

  userFuelConsumptionSummaryRepository: IUserFuelConsumptionSummaryRepository;
  userCarService: IUserCarService;
}

export class UserFuelConsumptionSummaryService
  extends BaseService
  implements IUserFuelConsumptionSummaryService
{
  private userFuelConsumptionSummaryRepository: IUserFuelConsumptionSummaryRepository;
  private userCarRepository: IUserCarService;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("UserFuelConsumptionSummaryService");

    this.knexClient = cradle.knexClient;
    this.userFuelConsumptionSummaryRepository =
      cradle.userFuelConsumptionSummaryRepository;
    this.userCarRepository = cradle.userCarService;
  }

  async get(
    options?: GetUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const userFuelConsumptionSummary =
        await this.userFuelConsumptionSummaryRepository.get(options);
      if (userFuelConsumptionSummary) {
        // populate cars
        const userCar = await this.userCarRepository.get({
          selection: {
            id: userFuelConsumptionSummary.userCarId,
          },
        });
        if (userCar) {
          userFuelConsumptionSummary.setCar(userCar);
        }
      }

      return userFuelConsumptionSummary;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const userFuelConsumptionSummarys =
        await this.userFuelConsumptionSummaryRepository.getAll(options);
      // populate cars
      const userCars = await this.userCarRepository.getAll({
        selection: {
          ids: userFuelConsumptionSummarys.map((x) => x.userCarId),
        },
      });
      for (const userFuelConsumptionSummary of userFuelConsumptionSummarys) {
        const userCar = userCars.find((c) =>
          c.id.equals(userFuelConsumptionSummary.userCarId)
        );
        if (userCar) {
          userFuelConsumptionSummary.setCar(userCar);
        }
      }

      return userFuelConsumptionSummarys;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userFuelConsumptionSummaryRepository.getCount(
        options
      );

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async persist(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { userFuelConsumptionSummary } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userFuelConsumptionSummaryRepository.persist(
        userFuelConsumptionSummary,
        {
          transaction,
        }
      );

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  async updateUserFuelConsumptionSummary(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "updateUserFuelConsumptionSummary",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { userFuelConsumptionSummary } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userFuelConsumptionSummaryRepository.update(
        userFuelConsumptionSummary,
        { transaction }
      );

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }
}
