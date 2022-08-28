import phin from "phin";

import { Uri } from "../";

export class Base64Util {
  public static encodeObject(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  }

  public static decodeObject<T>(str: string): T {
    return JSON.parse(Buffer.from(str, "base64").toString());
  }

  public static async encodeImageFromURL(url: Uri): Promise<string> {
    const image = await phin({ url: url.value });
    const raw = Buffer.from(image.body).toString("base64");

    if (!image.headers["content-type"]?.startsWith("image"))
      throw new Error("URL data given is not an image");

    return `data:${image.headers["content-type"]};base64,${raw}`;
  }
}
