import { FormSubmissionRepository } from './form-submission.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { FormSubmissionOptions } from './form-submission.options';
import type { Form } from '../form/form.entity';

import type { JSONObject } from '@okampus/shared/types';

@Entity({ customRepository: () => FormSubmissionRepository })
export class FormSubmission extends TenantScopedEntity {
  [EntityRepositoryType]!: FormSubmissionRepository;

  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'Form' })
  form!: Form;

  constructor(options: FormSubmissionOptions) {
    super(options);
    this.assign(options);
  }
}
