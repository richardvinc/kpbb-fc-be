import { ErrorObject, serializeError } from "serialize-error";
import { Info, VError } from "verror";

interface ErrorOptions {
  message?: string;
  cause?: Error;
}

export abstract class BaseError extends VError {
  public abstract readonly code: string;
  public readonly isPTMError = true;

  constructor(name: string, options?: ErrorOptions) {
    super({ name, cause: options?.cause }, options?.message || "");
  }

  toJSON(): ErrorObject {
    const obj = serializeError(this);
    delete obj.name;
    return obj;
  }

  toObject(): Info {
    return VError.info(this);
  }

  toString(): string {
    return VError.fullStack(this);
  }
}

export namespace InternalError {
  export class UnexpectedError extends BaseError {
    readonly code = "internal/server-error";
    constructor(cause?: Error, message?: string) {
      super("UnexpectedError", { cause, message });
    }
  }

  export class DomainError extends BaseError {
    readonly code = "internal/domain-error";
    constructor(name: string, message: string) {
      super("DomainError", { message: `${name}: ${message}` });
    }
  }
}

export namespace RequestError {
  export class InvalidArgumentError extends BaseError {
    readonly code = "request/invalid-argument";
    constructor(message: string) {
      super("InvalidArgumentError", { message });
    }
  }

  export class TooManyRequestError extends BaseError {
    readonly code = "request/too-many-request";
    constructor(message?: string) {
      super("TooManyRequestError", { message });
    }
  }
}
