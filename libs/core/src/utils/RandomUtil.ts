import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

export class RandomUtil {
  static generateAlphanumeric(length: number): string {
    return customAlphabet(alphanumeric, length)();
  }
}
