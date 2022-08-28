import { contentType, extension } from "mime-types";
import path from "path";

import { IFileInfo } from "@kopeka/types";

export class FileUtil {
  public static getFileInfoFromUrl(url: string): IFileInfo {
    const filename = path.basename(new URL(url).pathname);
    const type = contentType(filename) || "";

    return {
      name: filename,
      contentType: type,
      extension: extension(type) || "",
    };
  }

  public static getFileInfoFromName(name: string): IFileInfo {
    const type = contentType(name) || "";

    return {
      name: name,
      contentType: type,
      extension: extension(type) || "",
    };
  }
}
