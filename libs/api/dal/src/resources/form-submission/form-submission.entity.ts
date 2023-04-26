import { FormSubmissionEdit } from './form-submission-edit/form-submission-edit.entity';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import { diffJson } from 'diff';

import type { FormSubmissionOptions } from './form-submission.options';
import type { JSONObject } from '@okampus/shared/types';
import type { FormEdit } from '../form/form-edit/form-edit.entity';

@Entity()
export class FormSubmission extends TenantScopedEntity {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'FormEdit' })
  formEdit!: FormEdit;

  @OneToMany({ type: 'FormSubmissionEdit', mappedBy: 'formSubmission' })
  @TransformCollection()
  edits = new Collection<FormSubmissionEdit>(this);

  constructor(options: FormSubmissionOptions) {
    super(options);
    this.assign(options);

    this.edits.add([
      new FormSubmissionEdit({
        newVersion: options.submission,
        addedDiff: diffJson({}, options.submission),
        formSubmission: this,
        createdBy: options.createdBy,
        tenant: options.tenant,
      }),
    ]);
  }
}
