import { SortOrder } from './sort-order.enum';
import type { SortDto } from './sort.dto';

export function normalizeSort(sort: SortDto): Required<SortDto> {
  sort.sortBy = sort.sortBy ?? SortOrder.Newest;
  return sort as Required<SortDto>;
}
