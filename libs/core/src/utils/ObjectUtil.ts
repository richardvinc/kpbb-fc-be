import { detailedDiff } from "deep-object-diff";

export class ObjectUtil {
  public static difference(a: object, b: object): object {
    return detailedDiff(a, b);
  }
}
