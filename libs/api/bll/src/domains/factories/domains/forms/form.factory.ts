import { FormModel } from './form.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Form } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormRepository } from '@okampus/api/dal';

import type { TenantCore, Individual, FormOptions, ContentMaster, Org } from '@okampus/api/dal';
import type { IForm } from '@okampus/shared/dtos';

@Injectable()
export class FormFactory extends BaseFactory<FormModel, Form, IForm, FormOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, formRepository: FormRepository) {
    super(ep, formRepository, FormModel, Form);
  }

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
