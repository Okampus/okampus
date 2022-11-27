import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { PageInfo } from '@common/modules/pagination';
import type { BaseEntity } from '../entities/base.entity';
import { decodeCursor, encodeCursor } from '../utils/cursor-serializer';

type PaginationFindOptions<T extends BaseEntity, P extends string> = Omit<FindOptions<T, P>, 'limit' | 'offset' | 'orderBy'>;

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  private static readonly defaultLimit = 10;

  public async findWithPagination<P extends string = never>(
    paginationOptions?: PaginationOptions<T>,
    where: FilterQuery<T> = {} as FilterQuery<T>,
    baseOptions?: PaginationFindOptions<T, P>,
  ): Promise<PaginatedNodes<T>> {
    const limit = paginationOptions?.limit ?? BaseRepository.defaultLimit;
    // FIXME: 'id' might not always be the primary key, load it dynamically instead.
    const cursorColumn: keyof T = paginationOptions?.cursorColumn ?? 'id' as keyof T;

    let selector: '$gt' | '$lt' | undefined;
    let order: QueryOrder = QueryOrder.ASC;
    let offsetId: number | string | undefined;
    let offset: number | undefined;

    if (paginationOptions?.after) {
      offsetId = decodeCursor(paginationOptions.after);
      selector = '$gt';
    } else if (paginationOptions?.before) {
      offsetId = decodeCursor(paginationOptions.before);
      selector = '$lt';
      order = QueryOrder.DESC;
    } else if (paginationOptions?.offset && paginationOptions.offset > 0) {
      offset = paginationOptions.offset;
    } else {
      offset = 0;
    }

    const items = await this.find(
      offsetId && selector
        ? { ...where, [cursorColumn]: { [selector]: offsetId } }
        : where,
      // eslint-disable-next-line unicorn/no-array-method-this-argument
      {
        ...baseOptions,
        // @ts-expect-error: i don't know why `keyof T` is not recognized as a valid key for `orderBy`
        orderBy: { [cursorColumn]: order },
        limit,
        offset,
      },
    );

    const startCursorId = items.length > 0 ? items[0][cursorColumn] : null;
    const endCursorId = items.length > 0 ? items.slice(-1)[0][cursorColumn] : null;

    const [countBefore, countAfter] = await Promise.all([
      this.count({ ...where, [cursorColumn]: { $lt: startCursorId } }),
      this.count({ ...where, [cursorColumn]: { $gt: endCursorId } }),
    ]);

    const edges = items.map(value => ({
      node: value,
      // @ts-expect-error: `keyof T` cannot be used to index `Loaded<T, P>`...
      cursor: encodeCursor(value[cursorColumn]),
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
