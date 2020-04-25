import { ArrayTransformFn as ArrayTransform } from "@/utils/TransformUtil";

export default class ModelWrappedInPagination<T> {
  count: number|undefined;
  next: string|undefined;
  previous: string|undefined;
  @ArrayTransform()
  results: T[]|undefined;
}
