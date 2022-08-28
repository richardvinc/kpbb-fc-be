import { TimeUnit, TimeUnitEnum } from "../domain";

export class DateUtil {
  public static ToUnix(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  public static FromUnix(value: number): Date {
    return new Date(value * 1000);
  }

  public static ToYYYYMMDD(d: Date): string {
    const year = d.getFullYear().toString();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const date = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${date}`;
  }

  public static TimestampToGMTCron(d: Date): string {
    const minutes = d.getUTCMinutes();
    const hours = d.getUTCHours();
    const days = d.getUTCDate();
    const months = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();

    return `cron(${minutes} ${hours} ${days} ${months} ? ${year})`;
  }

  public static SubtractTimeUnitFromDate(unit: TimeUnit, d: Date): Date {
    switch (unit.value) {
      case TimeUnitEnum.MIN5:
        return new Date(d.valueOf() - 5 * 60 * 1000);
      case TimeUnitEnum.MIN15:
        return new Date(d.valueOf() - 15 * 60 * 1000);
      case TimeUnitEnum.HOUR1:
        return new Date(d.valueOf() - 60 * 60 * 1000);
      case TimeUnitEnum.DAY1:
        return new Date(d.valueOf() - 24 * 60 * 60 * 1000);
      default:
        return d;
    }
  }

  public static SubtractHourFromDate(hourToSubtract: number, d: Date): Date {
    return new Date(d.valueOf() - hourToSubtract * 60 * 60 * 1000);
  }

  public static TimeUnitToHumanReadableText(unit: TimeUnit): string | null {
    // unit example: MIN5, DAY1

    const frRegex = unit.value.match(/\D+/g);
    if (!frRegex) return null;

    const bkRegex = unit.value.match(/\d+/g);
    if (!bkRegex) return null;

    const frontPiece = frRegex[0];
    const backPiece = bkRegex[0];

    switch (frontPiece) {
      case `SEC`:
        return `${backPiece} detik`;
      case `MIN`:
        return `${backPiece} menit`;
      case `HOUR`:
        return `${backPiece} jam`;
      case `DAY`:
        return `${backPiece} hari`;
    }

    return null;
  }

  public static HourToDayReadableText(hour: number): string {
    if (hour < 24) return `${hour} jam`;
    else return `${Math.floor(hour / 24)} hari`;
  }
}
