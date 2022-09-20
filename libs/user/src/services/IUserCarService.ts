import { UserCar } from "../domains";
import { GetAllUserCarSelection, GetUserCarSelection } from "../repositories";

export interface IUserCarService {
  get(options?: GetUserCarSelection): Promise<UserCar | undefined>;
  getAll(options?: GetAllUserCarSelection): Promise<UserCar[]>;
  getCount(options?: GetAllUserCarSelection): Promise<number>;

  createUserCar(userCar: UserCar): Promise<void>;
  // updateUserCar(userCar: UserCar): Promise<void>;
}
