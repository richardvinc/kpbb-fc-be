import { CarSubModel } from "../domains";
import {
  GetAllCarSubModelSelection,
  GetCarSubModelSelection,
} from "../repositories/ICarSubModelRepository";

export interface ICarService {
  // car brand
  // getCarBrand(
  //   options?: GetCarBrandSelection
  // ): Promise<CarBrand | undefined>;
  // getAllCarBrand(
  //   options?: GetAllCarBrandSelection
  // ): Promise<CarBrand[]>;

  // // car model
  // getCarModel(
  //   options?: GetCarModelSelection
  // ): Promise<CarModel | undefined>;
  // getAllCarModel(
  //   options?: GetAllCarModelSelection
  // ): Promise<CarModel[]>;

  // car sub model
  getCarSubModel(
    options?: GetCarSubModelSelection
  ): Promise<CarSubModel | undefined>;
  getAllCarSubModel(
    options?: GetAllCarSubModelSelection
  ): Promise<CarSubModel[]>;
  getCountCarSubModel(options?: GetAllCarSubModelSelection): Promise<number>;

  createCarSubModel(car: CarSubModel): Promise<void>;
  updateCarSubModel(car: CarSubModel): Promise<void>;
}
