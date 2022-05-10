export interface PaginatedResult<T> {
  items: T[]; // Responded items
  itemCount: number; // Number of items in response
  itemsPerPage: number; // Size of each page
  offset: number; // Item number to start at
  page: number; // Current page index
  totalPages: number; // Number of total pages
  totalItemCount: number; // Number of total items
}
