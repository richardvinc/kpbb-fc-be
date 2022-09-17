import Knex from "knex";

import { BaseService, getCurrentHub } from "@KPBBFC/core";

import { Car } from "../domains";
import {
  GetAllCarSelection,
  GetCarSelection,
  ICarRepository,
} from "../repositories/ICarRepository";
import { ICarService } from "./ICarService";

interface Cradle {
  knexClient: Knex;

  carRepository: ICarRepository;
}

export class CarSerive extends BaseService implements ICarService {
  private carRepository: ICarRepository;

  private knexClient: Knex;

  constructor(cradle: Cradle) {
    super("CarService");

    this.knexClient = cradle.knexClient;
    this.carRepository = cradle.carRepository;
  }

  async get(options?: GetCarSelection): Promise<Car | undefined> {
    const logger = this.logger.child({
      methodName: "get",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carRepository.get(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getAll(options?: GetAllCarSelection): Promise<Car[]> {
    const logger = this.logger.child({
      methodName: "getAll",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carRepository.getAll(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async getCount(options?: GetAllCarSelection): Promise<number> {
    const logger = this.logger.child({
      methodName: "getCount",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { options } });

    try {
      const response = await this.carRepository.getCount(options);

      return response;
    } catch (error) {
      logger.fatal(error as Error);
      throw error;
    }
  }

  async createCar(car: Car): Promise<void> {
    const logger = this.logger.child({
      methodName: "createCar",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { car } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.carRepository.persist(car, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }

  async updateCar(car: Car): Promise<void> {
    const logger = this.logger.child({
      methodName: "updateCar",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { car } });

    const transaction = await this.knexClient.transaction();

    try {
      await this.carRepository.update(car, { transaction });

      transaction.commit();
    } catch (error) {
      logger.fatal(error as Error);
      transaction.rollback();
      throw error;
    }
  }
}
