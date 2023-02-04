import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';
import { GetTenantByIdQuery } from './get-tenant-by-id.query';

@QueryHandler(GetTenantByIdQuery)
export class GetTenantByIdHandler implements IQueryHandler<GetTenantByIdQuery> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(query: GetTenantByIdQuery): Promise<TenantModel> {
    return await this.tenantFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
