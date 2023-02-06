// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantsService } from './tenants.service';

import { PaginatedTenantModel, TenantModel } from '../../factories/domains/tenants/tenant.model';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CreateDocumentDto, CreateTenantDto, UpdateTenantDto } from '@okampus/shared/dtos';
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
  tenants(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.tenantsService.find(options);
  }

  @Mutation(() => TenantModel)
  createTenant(@Args('tenant', { type: () => CreateTenantDto }) tenant: CreateTenantDto) {
    return this.tenantsService.create(tenant);
  }

  @Mutation(() => OrgDocumentModel)
  tenantAddDocument(
    @Args('tenantId', { type: () => String }) tenantId: Snowflake,
    @Args('createDocument', { type: () => CreateDocumentDto }) createDocument: CreateDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ): Promise<OrgDocumentModel> {
    return this.tenantsService.tenantAddDocument(tenantId, createDocument, documentFile);
  }

  @Mutation(() => TenantModel)
  updateTenant(@Args('updateTenant', { type: () => UpdateTenantDto }) updateTenant: UpdateTenantDto) {
    return this.tenantsService.update(updateTenant);
  }

  @Mutation(() => Boolean)
  deleteTenant(@Args('id', { type: () => String }) id: Snowflake) {
    return this.tenantsService.delete(id);
  }
}
