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

  persist(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void>;
  updateUserFuelConsumptionSummary(
    userFuelConsumptionSummary: UserFuelConsumptionSummary
  ): Promise<void>;
}
