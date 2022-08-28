import crypto, { BinaryToTextEncoding } from "crypto";

export class CryptoUtil {
  public static hash(
    algorithm: string,
    value: string,
    encoding: BinaryToTextEncoding
  ): string {
    return crypto.createHash(algorithm).update(value).digest(encoding);
  }

  public static encode(
    value: string,
    encoding: BufferEncoding = "base64"
  ): string {
    return Buffer.from(value).toString(encoding);
  }

  public static decode(
    encoded: string,
    encoding: BufferEncoding = "base64"
  ): string {
    return Buffer.from(encoded, encoding).toString("ascii");
  }
}
