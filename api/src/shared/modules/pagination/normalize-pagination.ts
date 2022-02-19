import type { PaginateDto } from './paginate.dto';

export function normalizePagination(pagination: PaginateDto): Required<PaginateDto> {
  pagination.page ||= 1;
  pagination.itemsPerPage ??= 10;
  return pagination as Required<PaginateDto>;
}
