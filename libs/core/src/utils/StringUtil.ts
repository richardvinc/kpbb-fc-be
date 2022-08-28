export class StringUtil {
  public static ToProper(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  }

  // convert to 62... (accepted by domain)
  public static SanitizePhone(str: string): string {
    if (str.startsWith("08")) return `62${str.substring(1)}`;
    else if (str.startsWith("8")) return `62${str}`;
    else if (str.startsWith("+62")) return `${str.substring(1)}`;
    return str;
  }

  // convert to 08...
  public static ConvertPhoneNumberToZeroPrefix(str: string): string {
    if (str.startsWith("+62")) return `0${str.substring(3)}`;
    else if (str.startsWith("62")) return `0${str.substring(2)}`;

    return str;
  }
}
