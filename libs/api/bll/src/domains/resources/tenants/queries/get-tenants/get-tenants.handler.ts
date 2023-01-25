import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TenantFactory } from '../../../../factories/tenants/tenant.factory';
import { PaginatedTenantModel } from '../../../../factories/tenants/tenant.model';
import { GetTenantsQuery } from './get-tenants.query';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(query: GetTenantsQuery): Promise<PaginatedTenantModel> {
    return await this.tenantFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
