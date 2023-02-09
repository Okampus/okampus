import { BaseRepository } from '../../../shards/abstract/base/base.repository';

import type { FindOptions } from '@mikro-orm/core';
import type { Snowflake } from '@okampus/shared/types';
import type { Team } from './team.entity';

export class TeamRepository extends BaseRepository<Team> {
  async findSearchable(tenantId: Snowflake, findOptions: FindOptions<Team> = {}) {
    const teamPopulate = ['actor', 'actor.actorImages', 'actor.actorImages.image', 'children.actor'] as never[];
    return this.find({ tenant: { id: tenantId } }, { ...findOptions, populate: teamPopulate });
  }
}
