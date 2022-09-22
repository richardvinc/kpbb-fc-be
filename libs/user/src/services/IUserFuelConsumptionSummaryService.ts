import { CarSubModel } from "@KPBBFC/car";
import { UniqueEntityId } from "@KPBBFC/core";

import { UserFuelConsumptionSummary } from "../domains";
import {
  GetAllUserFuelConsumptionSummarySelection,
  GetUserFuelConsumptionSummarySelection,
} from "../repositories";

export interface IUserFuelConsumptionSummaryService {
  get(
    options?: GetUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary | undefined>;
  getAll(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<UserFuelConsumptionSummary[]>;
  getCount(
    options?: GetAllUserFuelConsumptionSummarySelection
  ): Promise<number>;

  getUniqueCarSubModel(): Promise<CarSubModel[]>;

  calculateProperties(userCarId: UniqueEntityId): Promise<void>;

  persist(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void>;
  update(userFuelConsumptionSummary: UserFuelConsumptionSummary): Promise<void>;
}
