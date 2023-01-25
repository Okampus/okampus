import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { User } from './user.entity';

export class UserRepository extends BaseRepository<User> {
  async findOneByQuery(slugOrEmail: string): Promise<User | null> {
    return this.findOne({ actor: { $or: [{ slug: slugOrEmail }, { primaryEmail: slugOrEmail }] } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ actor: { primaryEmail: email } });
  }
}
