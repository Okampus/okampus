import { BaseRepository } from '../../../shards/abstract/base/base.repository';
import { ANON_ACCOUNT_SLUG } from '@okampus/shared/consts';

import type { Snowflake } from '@okampus/shared/types';
import type { FindOneOptions, FindOptions } from '@mikro-orm/core';
import type { User } from './user.entity';

export class UserRepository extends BaseRepository<User> {
  async findOneByQuery(slugOrEmail: string, findOneOptions?: FindOneOptions<User>): Promise<User | null> {
    return this.findOne({ actor: { $or: [{ slug: slugOrEmail }, { primaryEmail: slugOrEmail }] } }, findOneOptions);
  }

  async findSearchable(tenantId: Snowflake, findOptions: FindOptions<User> = {}) {
    const userPopulate = [
      'actor',
      'actor.actorImages',
      'actor.actorImages.image',
      'teamMemberships',
      'teamMemberships.team.actor',
    ] as never[];

    return this.find(
      { tenant: { id: tenantId }, actor: { slug: { $ne: ANON_ACCOUNT_SLUG } } },
      { ...findOptions, populate: userPopulate }
    );
  }
}
