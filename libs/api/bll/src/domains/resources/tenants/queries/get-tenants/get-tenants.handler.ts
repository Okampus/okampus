import { GetTenantsQuery } from './get-tenants.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedTenantModel } from '../../../../factories/domains/tenants/tenant.model';

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
