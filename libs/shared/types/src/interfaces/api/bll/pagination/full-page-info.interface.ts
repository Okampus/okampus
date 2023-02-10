export interface FullPageInfo<T> {
  items: T[];
  itemsPerPage: number;
  itemCount: number;
  totalItemCount: number;
  totalPages: number;
  offset: number;
  page: number;
}
