import { PaginatedTenantModel, TenantModel } from '../../factories/domains/tenants/tenant.model';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import type { TenantsService } from './tenants.service';
import type { CreateDocumentDto, CreateTenantDto, UpdateTenantDto } from '@okampus/shared/dtos';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => TenantModel)
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => TenantModel)
  tenantById(@Args('id', { type: () => String }) id: Snowflake) {
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

  @Mutation(() => OrgDocumentModel)
  tenantAddDocument(
    @Args('tenantId') tenantId: string,
    @Args('createDocument') createDocument: CreateDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ): Promise<OrgDocumentModel> {
    return this.tenantsService.tenantAddDocument(tenantId, createDocument, documentFile);
  }

  @Mutation(() => TenantModel)
  updateTenant(@Args('updateTenant') updateTenant: UpdateTenantDto) {
    return this.tenantsService.update(updateTenant);
  }

  @Mutation(() => Boolean)
  deleteTenant(@Args('id', { type: () => String }) id: Snowflake) {
    return this.tenantsService.delete(id);
  }
}
