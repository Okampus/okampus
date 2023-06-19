import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { FormSubmissionOptions } from './form-submission.options';
import type { JSONObject } from '@okampus/shared/types';
import type { Form } from '../form/form.entity';

@Entity()
export class FormSubmission extends TenantScopedEntity {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'Form' })
  form!: Form;

  constructor(options: FormSubmissionOptions) {
    super(options);
    this.assign(options);
  }
}
