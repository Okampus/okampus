import { CreateTenantCommand } from './commands/create-tenant/create-tenant.command';
import { DeleteTenantCommand } from './commands/delete-tenant/delete-tenant.command';
import { UpdateTenantCommand } from './commands/update-tenant/update-tenant.command';
import { GetTenantByIdQuery } from './queries/get-tenant-by-id/get-tenant-by-id.query';
import { GetTenantBySlugQuery } from './queries/get-tenant-by-slug/get-tenant-by-slug.query';
import { GetTenantsQuery } from './queries/get-tenants/get-tenants.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { CreateOrgDocumentCommand } from '../org-documents/commands/create-org-document/create-org-document.command';
import { Injectable } from '@nestjs/common';
import { OrgDocumentType } from '@okampus/shared/enums';
import type { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateDocumentDto, CreateTenantDto, UpdateTenantDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { TenantModel, PaginatedTenantModel } from '../../factories/domains/tenants/tenant.model';

const defaultTenantPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class TenantsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<TenantModel> {
    const query = new GetTenantByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultTenantPopulate));
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: string): Promise<TenantModel> {
    const query = new GetTenantBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultTenantPopulate));
    return this.queryBus.execute(query);
  }

  findBareBySlug(slug: string): Promise<TenantModel> {
    const query = new GetTenantBySlugQuery(slug, this.tenant());
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTenantModel> {
    const query = new GetTenantsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultTenantPopulate));
    return this.queryBus.execute(query);
  }

  create(createTenant: CreateTenantDto): Promise<TenantModel> {
    const command = new CreateTenantCommand(createTenant, this.requester());
    return this.commandBus.execute(command);
  }

  tenantAddDocument(tenantId: Snowflake, createDocument: CreateDocumentDto, documentFile: MulterFileType) {
    const command = new CreateOrgDocumentCommand(
      tenantId,
      { ...createDocument, type: OrgDocumentType.TenantGuide },
      documentFile,
      this.tenant()
    );
    return this.commandBus.execute(command);
  }

  update(updateTenant: UpdateTenantDto): Promise<TenantModel> {
    const command = new UpdateTenantCommand(updateTenant, this.tenant(), this.autoGqlPopulate(defaultTenantPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteTenantCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
