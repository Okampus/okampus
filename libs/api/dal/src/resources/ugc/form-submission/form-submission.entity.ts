import { FormSubmissionRepository } from './form-submission.repository';
import { Ugc } from '../ugc.entity';

import { FormSubmissionEdit } from '../../edit/form-submission-edit/form-submission-edit.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';

import { diffJson } from 'diff';

import type { FormEdit } from '../../edit/form-edit/form-edit.entity';
import type { FormSubmissionOptions } from './form-submission.options';
import type { JSONObject } from '@okampus/shared/types';

@Entity({ customRepository: () => FormSubmissionRepository })
export class FormSubmission extends Ugc {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'FormEdit' })
  linkedFormEdit!: FormEdit;

  constructor(options: FormSubmissionOptions) {
    super({ ...options, ugcKind: UgcKind.FormSubmission });
    this.assign({ ...options, ugcKind: UgcKind.FormSubmission });

    this.edits.add([
      new FormSubmissionEdit({
        newVersion: options.submission,
        addedDiff: diffJson({}, options.submission),
        createdBy: options.createdBy,
        linkedUgc: this,
        tenant: options.tenant,
      }),
    ]);
  }
}
