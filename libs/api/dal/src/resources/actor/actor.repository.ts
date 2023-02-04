import { nanoid } from 'nanoid';
import { BaseRepository } from '../../shards/abstract/base/base.repository';

import type { Actor } from './actor.entity';

export class ActorRepository extends BaseRepository<Actor> {
  //
  async ensureUniqueSlug(slug: string, tenantId: string): Promise<string> {
    const existingActor = await this.findOne({ slug, tenant: { id: tenantId } });
    if (existingActor) {
      return this.ensureUniqueSlug(`${slug}-${nanoid(5)}`, tenantId);
    }
    return slug;
  }
}
