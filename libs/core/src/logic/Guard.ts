import { Schema } from "joi";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

type Result<T> = PositiveResult<T> | NegativeResult;

interface PositiveResult<T> {
  succeeded: true;
  value: T;
}

interface NegativeResult {
  succeeded: false;
  message: string;
}

export class Guard {
  public static against<T>(schema: Schema, value: any): Result<T> {
    const result = schema.validate(value, { abortEarly: false });
    if (result.error) {
      return {
        succeeded: false,
        message: result.error.message,
      };
    } else {
      return { succeeded: true, value: result.value as T };
    }
  }
}
