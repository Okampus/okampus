import { FormSubmissionModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormEdit, FormSubmissionRepository } from '@okampus/api/dal';
import { FormSubmission, TenantCore, ContentMaster, Individual, Org } from '@okampus/api/dal';

import type { FormSubmissionOptions } from '@okampus/api/dal';
import type { IFormSubmission } from '@okampus/shared/dtos';

@Injectable()
export class FormSubmissionFactory extends BaseFactory<
  FormSubmissionModel,
  FormSubmission,
  IFormSubmission,
  FormSubmissionOptions
> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    formSubmissionRepository: FormSubmissionRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, formSubmissionRepository, FormSubmissionModel, FormSubmission);
  }

  modelToEntity(model: Required<FormSubmissionModel>): FormSubmission {
    const entity = new FormSubmission({
      ...model,
      contentMaster: model.contentMaster ? this.em.getReference(ContentMaster, model.contentMaster.id) : null,
      representingOrg: model.representingOrg ? this.em.getReference(Org, model.representingOrg.id) : null,
      realAuthor: this.em.getReference(Individual, model.author.id),
      linkedFormEdit: this.em.getReference(FormEdit, model.linkedFormEdit.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });

    entity.author = this.em.getReference(Individual, model.author.id);
    return entity;
  }
}
