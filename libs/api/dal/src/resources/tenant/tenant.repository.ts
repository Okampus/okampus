import { BaseRepository } from '../../shards/abstract/base/base.repository';
import type { Tenant } from './tenant.entity';
import type { FindOneOptions } from '@mikro-orm/core';

export class TenantRepository extends BaseRepository<Tenant> {
  public async findByDomain<P extends string>(
    domain: string,
    findOptions?: FindOneOptions<Tenant, P>,
  ): Promise<Tenant> {
    return await this.findOneOrFail({ domain }, findOptions);
  }

  public async findByOidcName<P extends string>(
    oidcName: string,
    findOptions?: FindOneOptions<Tenant, P>,
  ): Promise<Tenant> {
    return await this.findOneOrFail({ oidcName }, findOptions);
  }
}
