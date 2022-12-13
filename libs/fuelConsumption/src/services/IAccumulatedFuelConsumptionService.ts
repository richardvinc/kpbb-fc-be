import { UniqueEntityId } from "@KPBBFC/core";

import { AccumulatedFuelConsumption } from "../domains";
import {
  GetAccumulatedFuelConsumptionSelection,
  GetAllAccumulatedFuelConsumptionSelection,
} from "../repositories";

export interface IAccumulatedFuelConsumptionService {
  get(
    options?: GetAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption | undefined>;
  getAll(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<AccumulatedFuelConsumption[]>;
  getCount(
    options?: GetAllAccumulatedFuelConsumptionSelection
  ): Promise<number>;

  getTop10(isCar?: boolean): Promise<AccumulatedFuelConsumption[]>;

  calculateProperties(carSubModelId?: UniqueEntityId): Promise<void>;

  persist(
    accumulatedFuelConsumption: AccumulatedFuelConsumption
  ): Promise<void>;
  update(accumulatedFuelConsumption: AccumulatedFuelConsumption): Promise<void>;
}
