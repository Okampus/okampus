import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { labelize } from '../../modules/pagination/labelize.util';
import type { PaginatedResult } from '../../modules/pagination/pagination.interface';
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
    const offset = (paginationOptions.page - 1) * limit;

    const [items, total] = await this.findAndCount(
      query ?? ({} as FilterQuery<never>),
      { limit, offset, ...baseOptions },
    );

    return labelize(items, { offset, itemsPerPage: limit, total });
  }

  // TODO: findOneOrCreate — find the document, or create it
  // TODO: createOrFail — create the document, or fails if it already exists
  // TODO: removeOrFail — remove the document, or fails if it doesn't exist
  // TODO: findOneAndUpdate — find the document, or fails if it doesn't exist
  // TODO: findOneAndUpdateOrFail — find the document, or fails if it doesn't exist
}
