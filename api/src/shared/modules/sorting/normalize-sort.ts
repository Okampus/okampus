import { SortOrder } from './sort-order.enum';
import type { ContentSortDto, SortDto } from './sort.dto';

export function normalizeSort<T extends ContentSortDto | SortDto>(sort: T): Required<T> {
  sort.sortBy = sort.sortBy ?? SortOrder.Newest;
  return sort as Required<T>;
}
