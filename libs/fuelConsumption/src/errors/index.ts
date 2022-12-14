import { BaseError } from "@KPBBFC/core";

export namespace FuelConsumptionErrors {
  export class FuelConsumptionKmTravelledEqualOrLessThanPrevious extends BaseError {
    readonly code = "km_travelled_equal_or_less_than_previous";

    constructor() {
      super(`Given Km travelled is equal or less than previous entries`);
    }
  }
  export class FuelConsumptionNotFound extends BaseError {
    readonly code = "fuel_consumption_not_found";

    constructor() {
      super(`Fuel consumption data not found`);
    }
  }
}
