import type { CustomLabels, PaginateResult } from 'mongoose';

export const customLabels: CustomLabels & { pagingCounter: string } = {
  totalDocs: 'itemCount',
  docs: 'items',
  limit: 'itemsPerPage',
  page: 'page',
  nextPage: 'nextPage',
  prevPage: 'prevPage',
  totalPages: 'pageCount',
  pagingCounter: 'startAt',
};

export function labelize<T>(result: PaginateResult<T>): CustomPaginateResult<T> {
  return {
    itemCount: result.totalDocs,
    items: result.docs,
    itemsPerPage: result.limit,
    page: result.page,
    nextPage: result.nextPage,
    prevPage: result.prevPage,
    pageCount: result.totalPages,
    startAt: result.pagingCounter,
  };
}

export interface CustomPaginateResult<T> {
  itemCount: number;
  items: T[];
  itemsPerPage: number;
  page: number | null | undefined;
  nextPage: number | null | undefined;
  prevPage: number | null | undefined;
  pageCount: number;
  startAt: number;
}

export type CustomPaginationResponse<T> = CustomPaginateResult<T> | { items: T[] };
