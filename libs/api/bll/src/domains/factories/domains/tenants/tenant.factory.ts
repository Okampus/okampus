/* eslint-disable import/no-cycle */
import { TenantModel } from '../../index';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrgDocumentFactory } from '../documents/org-document.factory';
import { BaseFactory } from '../../base.factory';
import { addImagesToActor, separateActorProps } from '../../factory.utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageUploadProps, TenantRepository } from '@okampus/api/dal';
import { Form, Individual, Tag, Tenant, TenantCore } from '@okampus/api/dal';
import { FormType, OrgDocumentType } from '@okampus/shared/enums';

import type { TenantOptions } from '@okampus/api/dal';
import type { Populate } from '@mikro-orm/core';
import type { OrgDocumentModel } from '../documents/org-document.model';
import type { CreateDocumentDto, CreateTenantDto, IActorImage, ITenant, UpdateTenantDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Injectable()
export class TenantFactory extends BaseFactory<TenantModel, Tenant, ITenant, TenantOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    tenantRepository: TenantRepository,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly orgDocumentFactory: OrgDocumentFactory
  ) {
    super(eventPublisher, uploadService, tenantRepository, TenantModel, Tenant);
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
      bio: createTenant.bio,
      name: createTenant.name,
      slug: createTenant.slug,
      primaryEmail: createTenant.primaryEmail,
      parent: null,
      tags: [],
      createdBy: individual,
      tenant: tenantCore,
    };

    return await this.create(tenantOptions, async (tenantEntity) => {
      if (createTenant.eventValidationForm) {
        tenantEntity.eventValidationForm = new Form({
          description:
            "Formulaire officiel devant être rempli à la création d'un événement pour être valider par l'administration scolaire.",
          name: "Formulaire de validation d'événement",
          type: FormType.Internal,
          schema: createTenant.eventValidationForm,
          isTemplate: false,
          createdBy: null,
          tenant: tenantCore,
        });
      }
      return tenantEntity;
    });
  }

  async updateTenant(
    updateTenant: UpdateTenantDto,
    requester: Individual,
    tenant: TenantCore,
    populate: Populate<Tenant>,
    actorImages?: ActorImageUploadProps
  ) {
    // TODO: add Tenant roles and permissions
    // const canEdit = await this.canEditTeam(id, requester.id);
    // if (!canEdit) throw new ForbiddenException('You are not allowed to edit this team');

    const { id, eventValidationForm, ...updateTenantProps } = updateTenant;

    // TODO: add eventValidationForm edit

    const transform = async (linkedTenant: Tenant) => {
      if (actorImages)
        await addImagesToActor(
          linkedTenant.actor,
          linkedTenant.actor.actorKind(),
          actorImages,
          requester,
          tenant,
          this.uploadService
        );
      return linkedTenant;
    };

    const transformModel = async (model: TenantModel) => {
      if (actorImages && model.actor && model.actor.actorImages)
        model.actor.actorImages = model.actor.actorImages.filter((image: IActorImage) => !image.lastActiveDate);
      return model;
    };

    return await this.update(
      { id, tenant },
      populate,
      separateActorProps(updateTenantProps),
      false, // TODO: check permissions
      transform,
      transformModel
    );
  }

  modelToEntity(model: Required<TenantModel>): Tenant {
    return new Tenant({
      ...model,
      ...model.actor,
      parent: null,
      tags: model.actor.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      eventValidationForm: this.em.getReference(Form, model.eventValidationForm.id),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
