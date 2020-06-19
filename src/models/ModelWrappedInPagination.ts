import { Vote } from "./VoteModels";
import { TransformHelpers } from "@/helpers/TransformHelpers";

export abstract class ModelWrappedInPageNumberPagination {
  count: Readonly<number>|undefined;
  next: Readonly<string>|undefined;
  previous: Readonly<string>|undefined;
  abstract results: Readonly<any>|undefined;
}

export class VoteModelWrappedInPagination extends ModelWrappedInPageNumberPagination {
  @TransformHelpers.TypeSpecifiedArrayTransformFn(Vote)
  results: Readonly<Vote[]>|undefined;
}
