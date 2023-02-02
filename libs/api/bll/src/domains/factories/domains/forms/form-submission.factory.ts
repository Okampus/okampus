import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  ContentMaster,
  Form,
  FormSubmission,
  FormSubmissionOptions,
  FormSubmissionRepository,
  Individual,
  Org,
  TenantCore,
} from '@okampus/api/dal';
import { IFormSubmission } from '@okampus/shared/dtos';
// import { loadFormSubmission } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { FormSubmissionModel } from './form-submission.model';

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

  // entityToModel(entity: FormSubmission): FormSubmissionModel | undefined {
  //   const formSubmission = loadFormSubmission(entity);
  //   if (!formSubmission) return undefined;
  //   return this.createModel(formSubmission);
  // }

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
