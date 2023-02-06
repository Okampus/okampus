import { GetTenantByIdQuery } from './get-tenant-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';

@QueryHandler(GetTenantByIdQuery)
export class GetTenantByIdHandler implements IQueryHandler<GetTenantByIdQuery> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(query: GetTenantByIdQuery): Promise<TenantModel> {
    return await this.tenantFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
