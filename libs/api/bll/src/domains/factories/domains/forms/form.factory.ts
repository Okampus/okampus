import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TenantCore, Form, FormRepository, Individual, FormOptions, ContentMaster, Org } from '@okampus/api/dal';
import { IForm } from '@okampus/shared/dtos';
// import { loadForm } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { FormModel } from './form.model';

@Injectable()
export class FormFactory extends BaseFactory<FormModel, Form, IForm, FormOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, formRepository: FormRepository) {
    super(ep, formRepository, FormModel, Form);
  }

  // entityToModel(entity: Form): FormModel | undefined {
  //   const form = loadForm(entity);
  //   if (!form) return undefined;
  //   return this.createModel(form);
  // }

  modelToEntity(model: Required<FormModel>): Form {
    return new Form({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      realAuthor: { id: model.author.id } as Individual,
      representingOrg: model.representingOrg ? ({ id: model.representingOrg.id } as Org) : null,
      contentMaster: model.contentMaster ? ({ id: model.contentMaster.id } as ContentMaster) : null,
    });
  }
}