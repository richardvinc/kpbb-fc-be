import Knex from "knex";

import { ICarSubModelRepository } from "@KPBBFC/car";
import { BaseService, getCurrentHub, UniqueEntityId } from "@KPBBFC/core";
import { OrderDirection } from "@KPBBFC/db/repository/BaseRepository";
import { IUserFuelConsumptionSummaryService } from "@KPBBFC/user";

import { AccumulatedFuelConsumption } from "../domains";
import {
  AccumulatedFuelConsumptionOrderFields,
  GetAccumulatedFuelConsumptionSelection,
  GetAllAccumulatedFuelConsumptionSelection,
  IAccumulatedFuelConsumptionRepository,
} from "../repositories/IAccumulatedFuelConsumptionRepository";
import { IAccumulatedFuelConsumptionService } from "./";

interface Cradle {
  knexClient: Knex;

  accumulatedFuelConsumptionRepository: IAccumulatedFuelConsumptionRepository;
  carSubModelRepository: ICarSubModelRepository;
  userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;
}

export class AccumulatedFuelConsumptionService
  extends BaseService
  implements IAccumulatedFuelConsumptionService
{
  private afcRepository: IAccumulatedFuelConsumptionRepository;
  private carSubModelRepository: ICarSubModelRepository;
  private ufcSummaryService: IUserFuelConsumptionSummaryService;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("AccumulatedFuelConsumptionService");

    this.knexClient = cradle.knexClient;
    this.afcRepository = cradle.accumulatedFuelConsumptionRepository;
    this.carSubModelRepository = cradle.carSubModelRepository;
    this.ufcSummaryService = cradle.userFuelConsumptionSummaryService;
  }

  async get(
    options?: GetAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const AccumulatedFuelConsumption = await this.afcRepository.get(options);

      if (AccumulatedFuelConsumption) {
        // populate cars
        const car = await this.carSubModelRepository.get({
          selection: {
            id: AccumulatedFuelConsumption.carSubModelId,
          },
        });
        if (car) {
          AccumulatedFuelConsumption.setCar(car);
        }
      }

      return AccumulatedFuelConsumption;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const AccumulatedFuelConsumptions = await this.afcRepository.getAll(
        options
      );

      // populate cars
      const cars = await this.carSubModelRepository.getAll({
        selection: {
          ids: AccumulatedFuelConsumptions.map((x) => x.carSubModelId),
        },
      });
      for (const AccumulatedFuelConsumption of AccumulatedFuelConsumptions) {
        const car = cars.find((c) =>
          c.id.equals(AccumulatedFuelConsumption.carSubModelId)
        );
        if (car) {
          AccumulatedFuelConsumption.setCar(car);
        }
      }

      return AccumulatedFuelConsumptions;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async calculateProperties(carSubModelId?: UniqueEntityId): Promise<void> {
    const logger = this.logger.child({
      methodName: "calculateProperties",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");

    try {
      // only update/create for the given carSubModelId
      if (carSubModelId) {
        const carSubModel = await this.carSubModelRepository.get({
          selection: {
            id: carSubModelId,
          },
        });
        if (!carSubModel)
          throw `car sub model with id ${carSubModelId.toString()} not found`;

        const [totalKmTravelled, totalFuelFilled, totalAverage, totalCar] =
          await Promise.all([
            this.afcRepository.getTotalKmTravelled(carSubModelId),
            this.afcRepository.getTotalFuelFilled(carSubModelId),
            this.afcRepository.getTotalAverage(carSubModelId),
            this.afcRepository.getTotalCar(carSubModelId),
          ]);
        const accumulatedFuelConsumption = AccumulatedFuelConsumption.create({
          carBrandId: carSubModel.brandId,
          carModelId: carSubModel.modelId,
          carSubModelId,
          totalKmTravelled,
          totalFuelFilled,
          average: totalAverage,
          totalCar,
        });
        await this.upsert(accumulatedFuelConsumption);
      }
      // update all data for any available sub model ids on `user_fuel_consumption_summary` table
      else {
        const availableCars =
          await this.ufcSummaryService.getUniqueCarSubModel();
        for (const carSubModel of availableCars) {
          const [totalKmTravelled, totalFuelFilled, totalAverage, totalCar] =
            await Promise.all([
              this.afcRepository.getTotalKmTravelled(carSubModel.id),
              this.afcRepository.getTotalFuelFilled(carSubModel.id),
              this.afcRepository.getTotalAverage(carSubModel.id),
              this.afcRepository.getTotalCar(carSubModel.id),
            ]);

          const accumulatedFuelConsumption = AccumulatedFuelConsumption.create({
            carBrandId: carSubModel.brandId,
            carModelId: carSubModel.modelId,
            carSubModelId: carSubModel.id,
            totalKmTravelled,
            totalFuelFilled,
            average: totalAverage,
            totalCar,
          });
          await this.upsert(accumulatedFuelConsumption);
        }
      }
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getTop10(isCar?: boolean): Promise<AccumulatedFuelConsumption[]> {
    const logger = this.logger.child({
      methodName: "getTop10",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");

    try {
      const AccumulatedFuelConsumptions = await this.afcRepository.getAll({
        limit: 10,
        orderBy: [
          AccumulatedFuelConsumptionOrderFields.AVERAGE,
          OrderDirection.DESC,
        ],
        top10: true,
      });

      // populate cars
      const cars = await this.carSubModelRepository.getAll({
        selection: {
          ids: AccumulatedFuelConsumptions.map((x) => x.carSubModelId),
        },
        isCar,
      });
      for (const AccumulatedFuelConsumption of AccumulatedFuelConsumptions) {
        const car = cars.find((c) =>
          c.id.equals(AccumulatedFuelConsumption.carSubModelId)
        );
        if (car) {
          AccumulatedFuelConsumption.setCar(car);
        }
      }

      return AccumulatedFuelConsumptions.filter((x) => x.car);
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.afcRepository.getCount(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async upsert(
    accumulatedFuelConsumption: AccumulatedFuelConsumption
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "upsert",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({
      args: { accumulatedFuelConsumption },
    });

    try {
      const exists = await this.get({
        selection: {
          carSubModelId: accumulatedFuelConsumption.carSubModelId,
        },
      });

      if (exists) await this.update(accumulatedFuelConsumption);
      else await this.persist(accumulatedFuelConsumption);
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async persist(
    accumulatedFuelConsumption: AccumulatedFuelConsumption
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "persist",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({
      args: { accumulatedFuelConsumption },
    });

    const transaction = await this.knexClient.transaction();

    try {
      await this.afcRepository.persist(accumulatedFuelConsumption, {
        transaction,
      });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  async update(
    accumulatedFuelConsumption: AccumulatedFuelConsumption
  ): Promise<void> {
    const logger = this.logger.child({
      methodName: "update",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({
      args: { accumulatedFuelConsumption },
    });

    const transaction = await this.knexClient.transaction();

    try {
      await this.afcRepository.update(accumulatedFuelConsumption, {
        transaction,
      });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }
}
