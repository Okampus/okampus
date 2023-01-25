import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { Tag } from './tag.entity';
import { Colors } from '@okampus/shared/enums';

export class TagRepository extends BaseRepository<Tag> {
  async findByColor(color: Colors): Promise<Tag[]> {
    return this.find({ color });
  }
}
