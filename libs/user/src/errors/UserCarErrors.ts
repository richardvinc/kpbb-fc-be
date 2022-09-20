import { BaseError } from "@KPBBFC/core";

export namespace UserCarErrors {
  export class UserCarAlreadyExistsError extends BaseError {
    readonly code = "user_car_already_exists";

    constructor(val: string) {
      super(`User car with plate number ${val} already exists`);
    }
  }
  export class UserCarNotFoundError extends BaseError {
    readonly code = "user_car_not_found";

    constructor() {
      super(`User car not found`);
    }
  }
  export class UserCarModelNotFoundError extends BaseError {
    readonly code = "user_car_model_not_found";

    constructor() {
      super(`Car with that model is not found`);
    }
  }
}
