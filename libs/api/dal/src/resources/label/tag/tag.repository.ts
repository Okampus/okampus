import { BaseRepository } from '../../../shards/abstract/base/base.repository';

import { nanoid } from 'nanoid';
import type { Tag } from './tag.entity';
import type { Colors } from '@okampus/shared/enums';

export class TagRepository extends BaseRepository<Tag> {
  async findByColor(color: Colors): Promise<Tag[]> {
    return this.find({ color });
  }

  async ensureUniqueSlug(slug: string, tenantId: string): Promise<string> {
    const existingTag = await this.findOne({ slug, tenant: { id: tenantId } });
    if (existingTag) {
      return this.ensureUniqueSlug(`${slug}-${nanoid(5)}`, tenantId);
    }
    return slug;
  }
}
