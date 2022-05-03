import type { QueryOrderMap } from '@mikro-orm/core';
import { ContentSortOrder, SortOrder } from './sort-order.enum';

export function serializeOrder(order?: ContentSortOrder | SortOrder, dateField = 'createdAt'): QueryOrderMap {
  if (!order)
    return {};

  switch (order) {
    case SortOrder.Newest:
    case ContentSortOrder.Newest:
      return { [dateField]: 'DESC' };
    case SortOrder.Oldest:
    case ContentSortOrder.Oldest:
      return { [dateField]: 'ASC' };
    case ContentSortOrder.Popular:
      return { votes: 'DESC' };
    case ContentSortOrder.Unpopular:
      return { votes: 'ASC' };
  }
}
