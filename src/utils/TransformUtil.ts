import { Transform } from "class-transformer";

export function ArrayTransformFn(value: any) {
  return Transform((v,o,t) => v.map((vv: any) => value(vv,o,t)));
}