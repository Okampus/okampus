import { EntityRepository } from '@mikro-orm/postgresql';
import type { FilterQuery, FindOneOptions, FindOneOrFailOptions } from '@mikro-orm/core';
import type { Snowflake } from '@okampus/shared/types';
import type { BaseEntity } from './base.entity';

// TODO: fix types

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  public async findById(id: Snowflake, findOptions?: FindOneOptions<T>): Promise<T | null> {
    return this.findOne({ id } as FilterQuery<T>, findOptions);
  }

  public async findByIdOrFail(id: Snowflake, findOptions?: FindOneOrFailOptions<T>): Promise<T> {
    return this.findOneOrFail({ id } as FilterQuery<T>, findOptions);
  }

  public async findByIds(ids: Snowflake[]): Promise<T[]> {
    return this.find({ id: { $in: ids } } as FilterQuery<T>);
  }

  // TODO: findOneOrCreate — find the document, or create it
  // TODO: createOrFail — create the document, or fail if it already exists
  // TODO: removeOrFail — remove the document, or fail if it doesn't exist
  // TODO: findOneAndUpdate — find a document and update it
  // TODO: findOneAndUpdateOrFail — find the document, or fail if it doesn't exist, and update it
}
