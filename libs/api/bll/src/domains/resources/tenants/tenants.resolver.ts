import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto } from '@okampus/shared/dtos';
import { PaginatedTenantModel, TenantModel } from '../../factories/tenants/tenant.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { UUID } from '@okampus/shared/types';

@Resolver(() => TenantModel)
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => TenantModel)
  tenantById(@Args('id', { type: () => String }) id: UUID) {
    return this.tenantsService.findOneById(id);
  }

  @Query(() => TenantModel)
  tenantBySlug(@Args('slug') slug: string) {
    return this.tenantsService.findOneBySlug(slug);
  }

  @Query(() => PaginatedTenantModel)
  tenants(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.tenantsService.find(options);
  }

  @Mutation(() => TenantModel)
  createTenant(@Args('tenant') tenant: CreateTenantDto) {
    return this.tenantsService.create(tenant);
  }

  @Mutation(() => TenantModel)
  updateTenant(@Args('updateTenant') updateTenant: UpdateTenantDto) {
    return this.tenantsService.update(updateTenant);
  }

  @Mutation(() => Boolean)
  deleteTenant(@Args('id', { type: () => String }) id: UUID) {
    return this.tenantsService.delete(id);
  }
}
