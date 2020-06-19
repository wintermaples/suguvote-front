import { Vote } from "./VoteEntities";
import { TransformHelpers } from "@/helpers/TransformHelpers";

export abstract class EntityWrappedInPageNumberPagination {
  count: Readonly<number>|undefined;
  next: Readonly<string>|undefined;
  previous: Readonly<string>|undefined;
  abstract results: Readonly<any>|undefined;
}

export class VoteWrappedInPagination extends EntityWrappedInPageNumberPagination {
  @TransformHelpers.TypeSpecifiedArrayTransformFn(Vote)
  results: Readonly<Vote[]>|undefined;
}
