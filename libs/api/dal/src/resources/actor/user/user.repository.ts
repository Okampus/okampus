import { FindOneOptions } from '@mikro-orm/core';
import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { User } from './user.entity';

export class UserRepository extends BaseRepository<User> {
  async findOneByQuery(slugOrEmail: string, findOneOptions?: FindOneOptions<User>): Promise<User | null> {
    return this.findOne({ actor: { $or: [{ slug: slugOrEmail }, { primaryEmail: slugOrEmail }] } }, findOneOptions);
  }
}
