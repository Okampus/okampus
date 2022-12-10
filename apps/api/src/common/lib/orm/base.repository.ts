/* eslint-disable object-curly-newline, unicorn/no-array-method-this-argument */
import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { PageInfo } from '@common/modules/pagination';
import type { BaseEntity } from '@lib/entities/base.entity';
import type { CursorColumns, CursorColumnTypes } from '@lib/types/interfaces/cursor-columns.interface';
import { decodeCursor, encodeCursor } from '@lib/utils/cursor-serializer';

type PaginationFindOptions<T extends BaseEntity, P extends string> = Omit<
  FindOptions<T, P>, 'limit' | 'offset' | 'orderBy'
>;

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  private static readonly defaultLimit = 10;

  public async findWithPagination<P extends string = never>(
    paginationOptions?: PaginationOptions,
    where: FilterQuery<T> = {} as FilterQuery<T>,
    baseOptions?: PaginationFindOptions<T, P>,
  ): Promise<PaginatedNodes<T>> {
    let columns: CursorColumns | null = null;

    const limit = paginationOptions?.limit ?? BaseRepository.defaultLimit;
    const offset: number = paginationOptions?.offset ?? 0;

    if (paginationOptions?.after) {
      columns = decodeCursor(paginationOptions.after);
    } else if (paginationOptions?.before) {
      // Invert the query order of the columns
      columns = Object.fromEntries(Object.entries(decodeCursor(paginationOptions.before)).map(
        ([colName, [value, order]]) => [colName, [value, order === QueryOrder.ASC ? QueryOrder.DESC : QueryOrder.ASC]],
      ));
    }

    // FIXME: 'id' might not always be the primary key, load it dynamically instead.
    const orderBy = paginationOptions?.orderBy ?? (columns
      ? Object.fromEntries(Object.entries(columns).map(([col, [_, order]]) => [col, order]))
      : { id: QueryOrder.ASC }
    );

    if (!('id' in orderBy))
      orderBy.id = QueryOrder.ASC;

    const colCondition = (colName: string, value: CursorColumnTypes, selector: '$gt' | '$lt'): FilterQuery<T> => (
      selector === '$lt'
        ? value === null ? { [colName]: { $ne: null } } : { [colName]: { [selector]: value } }
        : { $or: [{ [colName]: { $gt: value } }, { [colName]: { $eq: null } }] }
    ) as FilterQuery<T>;

    const getNextColsConditions = (
      colArray: Array<[colName: string, colInfo: [value: CursorColumnTypes, order: QueryOrder]]>,
    ): FilterQuery<T> => {
      const [lastCol, ...eqCols] = colArray.reverse();
      const lastColCondition = colCondition(
        lastCol[0], lastCol[1][0], lastCol[1][1] === QueryOrder.ASC ? '$gt' : '$lt',
      );

      if (eqCols.length === 0)
        return lastColCondition;

      const eqColsConditions = eqCols.map(([colName, [value, _]]) => ({ [colName]: { $eq: value } }));
      return {
        $and: [
          ...eqColsConditions,
          lastColCondition,
        ],
      } as FilterQuery<T>;
    };

    const getWhereFind = (findColumns: CursorColumns): FilterQuery<T> => {
      if (!findColumns)
        return {} as FilterQuery<T>;

      return {
        $or: Object.entries(findColumns).map(([_, [value, order]], idx, arr) => (
            value === null && order === QueryOrder.ASC
          ? null  // > NULL is always false
          : getNextColsConditions(arr.slice(0, idx + 1)))).filter(x => x !== null),
      } as FilterQuery<T>;
    };

    const items = await this.find(
      columns ? { ...where, ...getWhereFind(columns) } : where, { ...baseOptions, orderBy, limit, offset },
    );

    const startCusorColumns = (items.length > 0 ? Object.fromEntries(Object.entries(orderBy).map(
      ([colName, order]) => [
        colName, [items[0][colName as keyof T], order === QueryOrder.ASC ? QueryOrder.DESC : QueryOrder.ASC],
      ],
    )) : null) as CursorColumns | null;

    const endCursorColumns = (items.length > 0 ? Object.fromEntries(Object.entries(orderBy).map(
      ([colName, order]) => [colName, [items[items.length - 1][colName as keyof T], order]],
    )) : null) as CursorColumns | null;

    const [countBefore, countAfter] = await Promise.all([
      this.count({ ...where, ...getWhereFind(startCusorColumns!) }),
      this.count({ ...where, ...getWhereFind(endCursorColumns!) }),
    ]);

    const edges = items.map(value => ({
      node: value,
      cursor: encodeCursor(Object.fromEntries(Object.entries(orderBy).map(
        ([colName, order]) => [colName, [value[colName as keyof T] as CursorColumnTypes, order]],
      ))),
    }));

    const pageInfo = new PageInfo(edges, countBefore, countAfter, limit);
    return { edges, pageInfo };
  }

  // TODO: findOneOrCreate — find the document, or create it
  // TODO: createOrFail — create the document, or fail if it already exists
  // TODO: removeOrFail — remove the document, or fail if it doesn't exist
  // TODO: findOneAndUpdate — find a document and update it
  // TODO: findOneAndUpdateOrFail — find the document, or fail if it doesn't exist, and update it
}
