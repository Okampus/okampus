export function labelize<T>(
  result: T[],
  stats: { offset: number; itemsPerPage: number; total: number },
): CustomPaginateResult<T> {
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

export interface CustomPaginateResult<T> {
  items: T[]; // Responded items
  itemCount: number; // Number of items in response
  itemsPerPage: number; // Size of each page
  offset: number; // Item number to start at
  page: number; // Current page index
  totalPages: number; // Number of total pages
  totalItemCount: number; // Number of total items
}
