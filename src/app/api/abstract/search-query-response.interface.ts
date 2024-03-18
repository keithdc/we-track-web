export interface SearchQueryResponseInterface<T> {
  results: T[];
  length: number;
  count: number;
  pageNo: number;
  pageOf: number;
  pageSize: number;
}
