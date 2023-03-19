import { BaseRepository } from '../../../shards/abstract/base/base.repository';

import type { FindOptions } from '@mikro-orm/core';
import type { Snowflake } from '@okampus/shared/types';
import type { TenantEvent } from './event.entity';

export class TenantEventRepository extends BaseRepository<TenantEvent> {
  async findSearchable(tenantId: Snowflake, findOptions: FindOptions<TenantEvent> = {}) {
    const populate = ['tags', 'image', 'rootContent', 'rootContent.representingOrgs.actor'] as const;
    return this.find<(typeof populate)[number]>({ tenant: { id: tenantId } }, { ...findOptions, populate });
  }
}
