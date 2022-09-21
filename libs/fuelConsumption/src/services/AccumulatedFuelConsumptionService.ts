import Knex from "knex";

import { ICarSubModelRepository } from "@KPBBFC/car";
import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { AccumulatedFuelConsumption } from "../domains";
import {
  GetAccumulatedFuelConsumptionSelection,
  GetAllAccumulatedFuelConsumptionSelection,
  IAccumulatedFuelConsumptionRepository,
} from "../repositories/IAccumulatedFuelConsumptionRepository";
import { IAccumulatedFuelConsumptionService } from "./";

interface Cradle {
  knexClient: Knex;

  accumulatedFuelConsumptionRepository: IAccumulatedFuelConsumptionRepository;
  carSubModelRepository: ICarSubModelRepository;
}

export class AccumulatedFuelConsumptionService
  extends BaseService
  implements IAccumulatedFuelConsumptionService
{
  private accumulatedFuelConsumptionRepository: IAccumulatedFuelConsumptionRepository;
  private carSubModelRepository: ICarSubModelRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("AccumulatedFuelConsumptionService");

    this.knexClient = cradle.knexClient;
    this.accumulatedFuelConsumptionRepository =
      cradle.accumulatedFuelConsumptionRepository;
    this.carSubModelRepository = cradle.carSubModelRepository;
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
      const AccumulatedFuelConsumption =
        await this.accumulatedFuelConsumptionRepository.get(options);

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
      const AccumulatedFuelConsumptions =
        await this.accumulatedFuelConsumptionRepository.getAll(options);

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
      const response = await this.accumulatedFuelConsumptionRepository.getCount(
        options
      );

      return response;
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
      await this.accumulatedFuelConsumptionRepository.persist(
        accumulatedFuelConsumption,
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
      await this.accumulatedFuelConsumptionRepository.update(
        accumulatedFuelConsumption,
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
}
