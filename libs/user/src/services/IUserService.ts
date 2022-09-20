import { User } from "../domains";
import {
  GetAllUserSelection,
  GetUserSelection,
} from "../repositories/IUserRepository";

export interface IUserService {
  get(options?: GetUserSelection): Promise<User | undefined>;
  getAll(options?: GetAllUserSelection): Promise<User[]>;
  getCount(options?: GetAllUserSelection): Promise<number>;

  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
}
