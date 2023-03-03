import { FormModel } from './form.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormRepository } from '@okampus/api/dal';
import { ContentMaster, Form, Individual, Org, TenantCore } from '@okampus/api/dal';

import type { FormOptions } from '@okampus/api/dal';
import type { IForm } from '@okampus/shared/dtos';

@Injectable()
export class FormFactory extends BaseFactory<FormModel, Form, IForm, FormOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    formRepository: FormRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, formRepository, FormModel, Form);
  }

  modelToEntity(model: Required<FormModel>): Form {
    return new Form({
      ...model,
      contentMaster: model.contentMaster ? this.em.getReference(ContentMaster, model.contentMaster.id) : null,
      representingOrg: model.representingOrg ? this.em.getReference(Org, model.representingOrg.id) : null,
      realAuthor: this.em.getReference(Individual, model.author.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
