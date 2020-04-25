export default abstract class ModelWrappedInPagination {
  count: number|undefined;
  next: string|undefined;
  previous: string|undefined;
  abstract results: any|undefined;
}
