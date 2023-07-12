import { BaseRepository } from '../../shards/abstract/base/base.repository';
import { randomId } from '@okampus/shared/utils';

import type { Actor } from './actor.entity';

export class ActorRepository extends BaseRepository<Actor> {
  async ensureUniqueSlug(slug: string, tenantId: string): Promise<string> {
    const existingActor = await this.findOne({ slug, tenant: { id: tenantId } });
    if (existingActor) return this.ensureUniqueSlug(`${slug}-${randomId()}`, tenantId);
    return slug;
  }
}
