import { Car } from "../domains";
import {
  GetAllCarSelection,
  GetCarSelection,
} from "../repositories/ICarRepository";

export interface ICarService {
  get(options?: GetCarSelection): Promise<Car | undefined>;
  getAll(options?: GetAllCarSelection): Promise<Car[]>;
  getCount(options?: GetAllCarSelection): Promise<number>;

  createCar(car: Car): Promise<void>;
  updateCar(car: Car): Promise<void>;
}
