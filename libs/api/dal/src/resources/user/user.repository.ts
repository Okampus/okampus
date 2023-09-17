import { BaseRepository } from '../../shards/abstract/base/base.repository';
import type { User } from './user.entity';
import type { FindOneOptions } from '@mikro-orm/core';

export class UserRepository extends BaseRepository<User> {
  public async findBySlug<P extends string>(slug: string, findOptions?: FindOneOptions<User, P>): Promise<User> {
    return await this.findOneOrFail({ slug }, findOptions);
  }
}
