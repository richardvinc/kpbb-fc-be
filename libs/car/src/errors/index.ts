import { BaseError } from "@KPBBFC/core";

export namespace CarErrors {
  export class CarAlreadyExistsError extends BaseError {
    readonly code = "car_already_exists";

    constructor(id: string) {
      super(`Car with id ${id} already exists`);
    }
  }
  export class CarNotFoundError extends BaseError {
    readonly code = "car_not_found";

    constructor() {
      super(`Car not found`);
    }
  }
}
