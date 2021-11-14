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
      const [items, total] = await this.findAndCount(query ?? {}, baseOptions);
      return labelize(items, { offset: 0, itemsPerPage: items.length, total });
    }

    const limit = paginationOptions.itemsPerPage ?? 10;
    const offset = (paginationOptions.page - 1) * limit;

    const [items, total] = await this.findAndCount(query ?? {}, { limit, offset, ...baseOptions });

    return labelize(items, { offset, itemsPerPage: limit, total });
  }
}
