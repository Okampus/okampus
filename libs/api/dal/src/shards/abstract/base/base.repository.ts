import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';

import type { BaseEntity } from '../../../resources/base.entity';
import type { FilterQuery, FindOneOptions, FindOneOrFailOptions, FindOptions } from '@mikro-orm/core';

// TODO: fix types
export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  public async exists(where: FilterQuery<T>): Promise<boolean> {
    return !!(await this.count(where));
  }

  public async findById<P extends string>(id: string, findOptions?: FindOneOptions<T, P>): Promise<T | null> {
    return await this.findOne({ id } as FilterQuery<T>, findOptions);
  }

  public async findByIdOrFail<P extends string>(id: string, findOptions?: FindOneOrFailOptions<T, P>): Promise<T> {
    return await this.findOneOrFail({ id } as FilterQuery<T>, findOptions);
  }

  public async findByIds<P extends string>(
    ids: string[],
    findOptions?: FindOptions<T, P> & { failOnMiss?: boolean }
  ): Promise<T[]> {
    // eslint-disable-next-line unicorn/no-array-method-this-argument
    const result = await this.find({ id: { $in: ids } } as FilterQuery<T>, findOptions);
    if (findOptions?.failOnMiss && result.length !== ids.length)
      throw new BadRequestException('Not all entities were found');
    return result;
  }

  // TODO: findOneOrCreate — find the document, or create it
  // TODO: createOrFail — create the document, or fail if it already exists
  // TODO: removeOrFail — remove the document, or fail if it doesn't exist
  // TODO: findOneAndUpdate — find a document and update it
  // TODO: findOneAndUpdateOrFail — find the document, or fail if it doesn't exist, and update it
}
