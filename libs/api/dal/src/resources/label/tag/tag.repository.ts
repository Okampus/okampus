import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { Tag } from './tag.entity';
import { Colors } from '@okampus/shared/enums';
import { nanoid } from 'nanoid';

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
