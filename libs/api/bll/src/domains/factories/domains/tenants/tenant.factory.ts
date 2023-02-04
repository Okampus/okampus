import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import type { Individual, Tag, TenantOptions, TenantRepository } from '@okampus/api/dal';
import { Form, Tenant, TenantCore } from '@okampus/api/dal';
import type { CreateDocumentDto, CreateTenantDto, ITenant } from '@okampus/shared/dtos';
import { FormType, OrgDocumentType } from '@okampus/shared/enums';
// import { loadTenant } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { TenantModel } from './tenant.model';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { UploadService } from '../../../../features/uploads/upload.service';
import type { OrgDocumentFactory } from '../documents/org-document.factory';
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
    // populate: never[]
  ): Promise<OrgDocumentModel> {
    // const tenantOrg = await this.tenantRepository.findOneOrFail(tenantId, { populate });
    return await this.orgDocumentFactory.createOrgDocument(
      tenantId,
      { ...createDocument, type: OrgDocumentType.TenantGuide },
      documentFile,
      tenant
    );
    // this.tenantRepository.flush();
    // const tenantModel = this.entityToModel(tenantOrg);
    // if (!tenantModel) throw new BadRequestException(`Tenant with id ${tenantId} not found`);
    // return tenantModel;
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

  // entityToModel(entity: Tenant): TenantModel | undefined {
  //   const tenant = loadTenant(entity);
  //   if (!tenant) return undefined;
  //   return this.createModel(tenant);
  // }

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
