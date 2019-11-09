import Hashids from "hashids/cjs";

export class IdHelper {
  public static hashids = new Hashids();

  public static decode(value: string): Array<number | bigint> {
    return IdHelper.hashids.decode(value);
  }

  public static encode(...values: Array<number | bigint>): string {
    return IdHelper.hashids.encode(values);
  }
}
