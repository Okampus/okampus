import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { FormSubmission } from '../form-submission.entity';
import type { FormSubmissionEditOptions } from './form-submission-edit.options';
import type { JSONObject } from '@okampus/shared/types';

@Entity()
export class FormSubmissionEdit extends TenantScopedEntity {
  @Property({ type: 'json', nullable: true, default: null })
  addedDiff: JSONObject | null = null;

  @Property({ type: 'json' })
  newVersion!: JSONObject;

  @ManyToOne({ type: 'FormSubmission', onDelete: 'CASCADE' })
  formSubmission!: FormSubmission;

  constructor(options: FormSubmissionEditOptions) {
    super(options);
    this.assign(options);
  }
}
