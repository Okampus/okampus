import { BaseRepository } from '../../../shards/abstract/base/base.repository';

import type { TenantCore } from './tenant-core.entity';

export class TenantCoreRepository extends BaseRepository<TenantCore> {
  async findTenantByDomain(domain: string) {
    return this.findOne({ domain });
  }
}
