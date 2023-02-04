import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';
import { GetTenantBySlugQuery } from './get-tenant-by-slug.query';

@QueryHandler(GetTenantBySlugQuery)
export class GetTenantBySlugHandler implements IQueryHandler<GetTenantBySlugQuery> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(query: GetTenantBySlugQuery): Promise<TenantModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return await this.tenantFactory.findOneOrFail(where, { populate: query.populate });
  }
}
