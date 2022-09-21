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

  persist(
    accumulatedFuelConsumption: AccumulatedFuelConsumption
  ): Promise<void>;
  update(accumulatedFuelConsumption: AccumulatedFuelConsumption): Promise<void>;
}
