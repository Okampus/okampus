import { TenantModel } from './tenant.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrgDocumentFactory } from '../documents/org-document.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantRepository } from '@okampus/api/dal';

import { Form, Tenant, TenantCore } from '@okampus/api/dal';

import { FormType, OrgDocumentType } from '@okampus/shared/enums';
import type { Individual, Tag, TenantOptions } from '@okampus/api/dal';
import type { CreateDocumentDto, CreateTenantDto, ITenant } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { OrgDocumentModel } from '../documents/org-document.model';

@Injectable()
export class TenantFactory extends BaseFactory<TenantModel, Tenant, ITenant, TenantOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly orgDocumentFactory: OrgDocumentFactory,
    private readonly tenantRepository: TenantRepository,
    private readonly uploadService: UploadService
  ) {
    super(ep, tenantRepository, TenantModel, Tenant);
  }

  async tenantAddDocument(
    tenantId: Snowflake,
    createDocument: CreateDocumentDto,
    documentFile: MulterFileType,
    tenant: TenantCore
  ): Promise<OrgDocumentModel> {
    return await this.orgDocumentFactory.createOrgDocument(
      tenantId,
      { ...createDocument, type: OrgDocumentType.TenantGuide },
      documentFile,
      tenant
    );
  }

  // TODO: add tenantEditDocument

  async createTenant(createTenant: CreateTenantDto, individual: Individual): Promise<TenantModel> {
    const tenantCore = new TenantCore({
      name: createTenant.tenant.name,
      domain: createTenant.tenant.domain,
      oidcInfo: createTenant.tenant.oidcInfo,
    });

    const tenantOptions = {
      tenant: tenantCore,
      name: createTenant.name,
      slug: createTenant.slug,
      bio: createTenant.bio,
      parent: null,
      primaryEmail: createTenant.primaryEmail,
      tags: [],
    };

    return await this.create(tenantOptions, async (tenantEntity) => {
      if (createTenant.eventValidationForm) {
        tenantEntity.eventValidationForm = new Form({
          name: "Formulaire de validation d'événement",
          type: FormType.Internal,
          schema: createTenant.eventValidationForm,
          isTemplate: false,
          realAuthor: individual,
          tenant: tenantCore,
        });
      }
      return tenantEntity;
    });
  }

  modelToEntity(model: Required<TenantModel>): Tenant {
    return new Tenant({
      ...model,
      ...model.actor,
      tenant: { id: model.tenant.id } as TenantCore,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
      parent: null,
      eventValidationForm: { id: model.eventValidationForm.id } as Form,
    });
  }
}
