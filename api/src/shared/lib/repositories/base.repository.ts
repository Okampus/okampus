import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { labelize } from '../../modules/pagination';
import type { PaginatedResult } from '../../modules/pagination';
import type { BaseEntity } from '../entities/base.entity';

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  public async findWithPagination(
    paginationOptions?: { page: number; itemsPerPage: number } | null,
    query?: FilterQuery<T>,
    baseOptions?: Omit<FindOptions<T>, 'limit' | 'offset'>,
  ): Promise<PaginatedResult<T>> {
    if (!paginationOptions) {
      const [items, total] = await this.findAndCount(query ?? ({} as FilterQuery<never>), baseOptions);
      return labelize(items, { offset: 0, itemsPerPage: items.length, total });
    }

    const limit = paginationOptions.itemsPerPage ?? 10;
    // FIXME: Do not use offset
    const offset = (paginationOptions.page - 1) * limit;

    const [items, total] = await this.findAndCount(
      query ?? ({} as FilterQuery<never>),
      { limit, offset, ...baseOptions },
    );

    return labelize(items, { offset, itemsPerPage: limit, total });
  }

  // TODO: findOneOrCreate — find the document, or create it
  // TODO: createOrFail — create the document, or fail if it already exists
  // TODO: removeOrFail — remove the document, or fail if it doesn't exist
  // TODO: findOneAndUpdate — find a document and update it
  // TODO: findOneAndUpdateOrFail — find the document, or fail if it doesn't exist, and update it
}
