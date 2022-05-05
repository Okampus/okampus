import type { PaginateDto } from './paginate.dto';

export function normalizePagination<T extends PaginateDto>(pagination: T): Required<T> {
  pagination.page ||= 1;
  pagination.itemsPerPage ??= 10;
  return pagination as Required<T>;
}
