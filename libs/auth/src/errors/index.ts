import { BaseError } from "@kopeka/core";

export namespace AuthErrors {
  export class InvalidPhoneNumber extends BaseError {
    readonly code = "auth/invalid-phone-number";

    constructor() {
      super("InvalidPhoneNumberError");
    }
  }

  export class InvalidToken extends BaseError {
    readonly code = "auth/invalid-token";

    constructor() {
      super("InvalidToken");
    }
  }

  export class NotRegistered extends BaseError {
    readonly code = "auth/not-registered";

    constructor() {
      super("NotRegistered");
    }
  }
}
