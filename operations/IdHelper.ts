const Hashids = require('hashids/cjs');

export class IdHelper { 
  static hashids = new Hashids();

  static decode(value: string): number[] {
    return IdHelper.hashids.decode(value);
  }

  static encode(...values: number[]): string {
    return IdHelper.hashids.encode(values);
  }  
}