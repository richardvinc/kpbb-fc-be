import { BaseError } from "@KPBBFC/core";

export namespace UserErrors {
  export class UserAlreadyExistsError extends BaseError {
    readonly code = "user_already_exists";

    constructor(id: string) {
      super(`User with id ${id} already exists`);
    }
  }
  export class UserNotFoundError extends BaseError {
    readonly code = "user_not_found";

    constructor() {
      super(`User not found`);
    }
  }
}
