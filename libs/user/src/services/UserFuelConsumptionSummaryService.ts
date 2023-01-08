import Knex from "knex";
import { uniq } from "lodash";

import { CarSubModel, ICarSubModelRepository } from "@KPBBFC/car";
import { BaseService, getCurrentHub, UniqueEntityId } from "@KPBBFC/core";

import { UserFuelConsumptionSummary } from "../domains";
import {
  IUserCarRepository as IUserCarService,
  IUserFuelConsumptionRepository,
} from "../repositories";
import {
  GetAllUserFuelConsumptionSummarySelection,
  GetUserFuelConsumptionSummarySelection,
  IUserFuelConsumptionSummaryRepository,
} from "../repositories/IUserFuelConsumptionSummaryRepository";
import { IUserFuelConsumptionSummaryService } from "./";

interface Cradle {
  knexClient: Knex;

  userFuelConsumptionRepository: IUserFuelConsumptionRepository;
  userFuelConsumptionSummaryRepository: IUserFuelConsumptionSummaryRepository;
  userCarService: IUserCarService;
  carSubModelRepository: ICarSubModelRepository;
}

export class UserFuelConsumptionSummaryService
  extends BaseService
  implements IUserFuelConsumptionSummaryService
{
  private userFuelConsumptionRepository: IUserFuelConsumptionRepository;
  private userFuelConsumptionSummaryRepository: IUserFuelConsumptionSummaryRepository;
  private userCarRepository: IUserCarService;
  private carSubModelRepository: ICarSubModelRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("UserFuelConsumptionSummaryService");

    this.knexClient = cradle.knexClient;
    this.userFuelConsumptionRepository = cradle.userFuelConsumptionRepository;
    this.userFuelConsumptionSummaryRepository =
      cradle.userFuelConsumptionSummaryRepository;
    this.userCarRepository = cradle.userCarService;
    this.carSubModelRepository = cradle.carSubModelRepository;
  }

  async getUniqueCarSubModel(): Promise<CarSubModel[]> {
    const logger = this.logger.child({
      methodName: "getUniqueCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");

    const userCars = await this.userCarRepository.getAll();
    const uniqueSubModelIds = userCars
      .map((uc) => uc.carSubModelId.toString())
      .filter(uniq);

    const carSubModels = await this.carSubModelRepository.getAll({
      selection: {
        ids: uniqueSubModelIds.map((id) => new UniqueEntityId(id)),
      },
    });

    logger.trace("END");
    return carSubModels;
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

  async calculateProperties(userCarId: UniqueEntityId): Promise<void> {
    const logger = this.logger.child({
      methodName: "calculateProperties",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { userCarId } });

    try {
      const userCar = await this.userCarRepository.get({
        selection: {
          id: userCarId,
        },
      });
      if (!userCar) throw `user car not found: ${userCarId.toString()}`;

      const carFuelConsumption =
        await this.userFuelConsumptionRepository.getAll({
          selection: {
            userCarIds: [userCarId],
          },
        });

      logger.debug({ carFuelConsumption });
      const lastEntry = await this.userFuelConsumptionRepository.getLastEntry({
        selection: {
          id: userCarId,
        },
      });

      const totalKmTravelled = lastEntry?.fuelConsumption.kmTravelled ?? 0;
      const totalFuelFilled =
        carFuelConsumption.length > 0
          ? carFuelConsumption.reduce(
              (acc, cur) => acc + cur.fuelConsumption.fuelFilled,
              0
            )
          : 0;
      const totalAverage =
        carFuelConsumption.length > 1
          ? carFuelConsumption.reduce(
              (acc, cur) => acc + cur.fuelConsumption.average,
              0
            ) /
              carFuelConsumption.length -
            1
          : carFuelConsumption.length === 1
          ? carFuelConsumption[0].fuelConsumption.average
          : 0;
      logger.debug({ totalAverage });

      const userFuelConsumptionSummary = UserFuelConsumptionSummary.create({
        totalKmTravelled,
        totalFuelFilled,
        average: totalAverage ?? 0,
        userId: userCar.userId,
        userCarId: userCar.id,
        carBrandId: userCar.carBrandId,
        carModelId: userCar.carModelId,
        carSubModelId: userCar.carSubModelId,
      });

      await this.upsert(userFuelConsumptionSummary);
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async upsert(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "upsert",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { userFuelConsumptionSummary } });

    try {
      const exists = await this.userFuelConsumptionSummaryRepository.get({
        selection: {
          userCarId: userFuelConsumptionSummary.userCarId,
        },
      });

      if (!exists) await this.persist(userFuelConsumptionSummary);
      else await this.update(userFuelConsumptionSummary);
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

  async update(
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
