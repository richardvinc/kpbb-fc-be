import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { UserFuelConsumption } from "../domains";
import { IUserCarRepository } from "../repositories";
import {
  GetAllUserFuelConsumptionSelection,
  GetUserFuelConsumptionSelection,
  IUserFuelConsumptionRepository,
} from "../repositories/IUserFuelConsumptionRepository";
import { IUserFuelConsumptionService } from "./";

interface Cradle {
  knexClient: Knex;

  userFuelConsumptionRepository: IUserFuelConsumptionRepository;
  userCarRepository: IUserCarRepository;
}

export class UserFuelConsumptionService
  extends BaseService
  implements IUserFuelConsumptionService
{
  private userFuelConsumptionRepository: IUserFuelConsumptionRepository;
  private userCarRepository: IUserCarRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("UserFuelConsumptionService");

    this.knexClient = cradle.knexClient;
    this.userFuelConsumptionRepository = cradle.userFuelConsumptionRepository;
    this.userCarRepository = cradle.userCarRepository;
  }

  async get(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const userFuelConsumption = await this.userFuelConsumptionRepository.get(
        options
      );
      if (userFuelConsumption) {
        // populate cars
        const userCar = await this.userCarRepository.get({
          selection: {
            id: userFuelConsumption.userCarId,
          },
        });
        if (userCar) {
          userFuelConsumption.setCar(userCar);
        }
      }

      return userFuelConsumption;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getLastEntry(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined> {
    const logger = this.logger.child({
      methodName: "getLastEntries",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.trace({ args: options });

    try {
      const userFuelConsumption =
        await this.userFuelConsumptionRepository.getLastEntry(options);
      if (userFuelConsumption) {
        // populate cars
        const userCar = await this.userCarRepository.get({
          selection: {
            id: userFuelConsumption.userCarId,
          },
        });
        if (userCar) {
          userFuelConsumption.setCar(userCar);
        }
      }

      return userFuelConsumption;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(
    options?: GetAllUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const userFuelConsumptions =
        await this.userFuelConsumptionRepository.getAll(options);
      // populate cars
      const userCars = await this.userCarRepository.getAll({
        selection: {
          ids: userFuelConsumptions.map((x) => x.userCarId),
        },
      });
      for (const userFuelConsumption of userFuelConsumptions) {
        const userCar = userCars.find((c) =>
          c.id.equals(userFuelConsumption.userCarId)
        );
        if (userCar) {
          userFuelConsumption.setCar(userCar);
        }
      }

      return userFuelConsumptions;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(
    options?: GetAllUserFuelConsumptionSelection
  ): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.userFuelConsumptionRepository.getCount(
        options
      );

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async persist(userFuelConsumption: UserFuelConsumption): Promise<void> {
    const logger = this.logger.child({
      methodName: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { UserFuelConsumption: userFuelConsumption } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.userFuelConsumptionRepository.persist(userFuelConsumption, {
        transaction,
      });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  // async updateUserFuelConsumption(UserFuelConsumption: UserFuelConsumption): Promise<void> {
  //   const logger = this.logger.child({
  //     methodName: "updateUserFuelConsumption",
  //     traceId: getCurrentHub().getTraceId(),
  //   });

  //   logger.trace("BEGIN");
  //   logger.debug({ args: { UserFuelConsumption } });

  //   const transaction = await this.knexClient.transaction();

  //   try {
  //     await this.UserFuelConsumptionRepository.update(UserFuelConsumption, { transaction });

  //     transaction.commit();
  //   } catch (error) {
  //     logger.fatal(error as Error);
  //     transaction.rollback();
  //     throw error;
  //   }
  // }
}
