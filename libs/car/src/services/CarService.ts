import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { CarSubModel } from "../domains";
import {
  GetAllCarSubModelSelection,
  GetCarSubModelSelection,
  ICarSubModelRepository,
} from "../repositories";
import { ICarService } from "./ICarService";

interface Cradle {
  knexClient: Knex;

  carSubModelRepository: ICarSubModelRepository;
}

export class CarService extends BaseService implements ICarService {
  private carSubModelRepository: ICarSubModelRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("CarService");

    this.knexClient = cradle.knexClient;
    this.carSubModelRepository = cradle.carSubModelRepository;
  }

  async getCarSubModel(
    options?: GetCarSubModelSelection | undefined
  ): Promise<CarSubModel | undefined> {
    const logger = this.logger.child({
      methodName: "getCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carSubModelRepository.get(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAllCarSubModel(
    options?: GetAllCarSubModelSelection | undefined
  ): Promise<CarSubModel[]> {
    const logger = this.logger.child({
      methodName: "getAllCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carSubModelRepository.getAll(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCountCarSubModel(
    options?: GetAllCarSubModelSelection | undefined
  ): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCountCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carSubModelRepository.getCount(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async createCarSubModel(car: CarSubModel): Promise<void> {
    const logger = this.logger.child({
      methodName: "createCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { car } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.carSubModelRepository.persist(car, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  async updateCarSubModel(car: CarSubModel): Promise<void> {
    const logger = this.logger.child({
      methodName: "updateCarSubModel",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { car } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.carSubModelRepository.update(car, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }
}
