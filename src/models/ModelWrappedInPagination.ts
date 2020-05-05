import { TypeSpecifiedArrayTransformFn } from "@/utils/TransformUtil";
import { Vote } from "./VoteModels";

export abstract class ModelWrappedInPageNumberPagination {
  count: Readonly<number>|undefined;
  next: Readonly<string>|undefined;
  previous: Readonly<string>|undefined;
  abstract results: Readonly<any>|undefined;
}

export class VoteModelWrappedInPagination extends ModelWrappedInPageNumberPagination {
  @TypeSpecifiedArrayTransformFn(Vote)
  results: Readonly<Vote[]>|undefined;
}
