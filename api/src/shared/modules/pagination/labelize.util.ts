import type { PaginatedResult } from './pagination.interface';

export function labelize<T>(
  result: T[],
  stats: { offset: number; itemsPerPage: number; total: number },
): PaginatedResult<T> {
  return {
    items: result,
    itemCount: result.length,
    itemsPerPage: stats.itemsPerPage,
    offset: stats.offset,
    page: stats.offset / stats.itemsPerPage,
    totalPages: Math.ceil(stats.total / stats.itemsPerPage),
    totalItemCount: stats.total,
  };
}
