import type { Snowflake } from '@okampus/shared/types';
import { BaseRepository } from '../../shards/abstract/base/base.repository';

import type { Org } from './org.entity';

export class OrgRepository extends BaseRepository<Org> {
  async findOrgById(id: Snowflake): Promise<Org | null> {
    return await this.findOne({ id }, { populate: ['actor'] });
  }

  async findOrgBySlug(slug: string): Promise<Org | null> {
    return await this.findOne({ actor: { slug } });
  }
}
