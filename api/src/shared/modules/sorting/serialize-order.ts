import type { QueryOrderMap } from '@mikro-orm/core';
import { SortOrder } from './sort-order.enum';

export function serializeOrder(order?: SortOrder): QueryOrderMap {
  if (!order)
    return {};

  switch (order) {
    case SortOrder.Newest:
      return { createdAt: 'DESC' };
    case SortOrder.Oldest:
      return { createdAt: 'ASC' };
    case SortOrder.Popular:
      return { votes: 'DESC' };
    case SortOrder.Unpopular:
      return { votes: 'ASC' };
  }
}
