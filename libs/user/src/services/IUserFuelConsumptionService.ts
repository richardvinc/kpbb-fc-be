import { UserFuelConsumption } from "../domains";
import {
  GetAllUserFuelConsumptionSelection,
  GetUserFuelConsumptionSelection,
} from "../repositories";

export interface IUserFuelConsumptionService {
  get(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined>;
  getAll(
    options?: GetAllUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption[]>;
  getCount(options?: GetAllUserFuelConsumptionSelection): Promise<number>;

  getLastEntry(
    options?: GetUserFuelConsumptionSelection
  ): Promise<UserFuelConsumption | undefined>;

  persist(userFuelConsumption: UserFuelConsumption): Promise<void>;
  // updateUserFuelConsumption(UserFuelConsumption: UserFuelConsumption): Promise<void>;
}
