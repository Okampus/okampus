import { BaseRepository } from '../../../shards/abstract/base/base.repository';
// eslint-disable-next-line import/no-cycle
import { Tenant } from './tenant.entity';

export class TenantRepository extends BaseRepository<Tenant> {
  async tenantExists(domain: string) {
    return !!(await this.findOne({ tenant: { domain } }));
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    return this.findOne({ actor: { primaryEmail: email } });
  }
}
