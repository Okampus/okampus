import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { TenantCore } from './tenant-core.entity';

export class TenantCoreRepository extends BaseRepository<TenantCore> {
  async findTenantByDomain(domain: string) {
    return this.findOne({ domain });
  }
}
