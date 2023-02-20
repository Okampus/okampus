import { BaseRepository } from '../../../shards/abstract/base/base.repository';

import type { FindOptions } from '@mikro-orm/core';
import type { Snowflake } from '@okampus/shared/types';
import type { Team } from './team.entity';

export class TeamRepository extends BaseRepository<Team> {
  async findSearchable(tenantId: Snowflake, findOptions: FindOptions<Team> = {}) {
    const populate = ['actor', 'actor.actorImages', 'actor.actorImages.image', 'children.actor'] as const;
    return this.find<(typeof populate)[number]>({ tenant: { id: tenantId } }, { populate, ...findOptions });
  }
}
