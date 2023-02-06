import { FormSubmissionModel } from './form-submission.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { FormSubmission } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormSubmissionRepository } from '@okampus/api/dal';

import type { ContentMaster, Form, FormSubmissionOptions, Individual, Org, TenantCore } from '@okampus/api/dal';
import type { IFormSubmission } from '@okampus/shared/dtos';

@Injectable()
export class FormSubmissionFactory extends BaseFactory<
  FormSubmissionModel,
  FormSubmission,
  IFormSubmission,
  FormSubmissionOptions
> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, formSubmissionRepository: FormSubmissionRepository) {
    super(ep, formSubmissionRepository, FormSubmissionModel, FormSubmission);
  }

  modelToEntity(model: Required<FormSubmissionModel>): FormSubmission {
    const entity = new FormSubmission({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      realAuthor: { id: model.author.id } as Individual,
      representingOrg: model.representingOrg ? ({ id: model.representingOrg.id } as Org) : null,
      forForm: { id: model.forForm.id } as Form,
      contentMaster: model.contentMaster ? ({ id: model.contentMaster.id } as ContentMaster) : null,
    });

    entity.author = { id: model.author.id } as Individual;
    return entity;
  }
}
