import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TenantFactory } from '../../../../factories/tenants/tenant.factory';
import { TenantModel } from '../../../../factories/tenants/tenant.model';
import { GetTenantByIdQuery } from './get-tenant-by-id.query';

@QueryHandler(GetTenantByIdQuery)
export class GetTenantByIdHandler implements IQueryHandler<GetTenantByIdQuery> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(query: GetTenantByIdQuery): Promise<TenantModel> {
    return await this.tenantFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
