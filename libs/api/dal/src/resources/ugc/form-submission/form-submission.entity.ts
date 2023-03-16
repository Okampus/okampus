import { FormSubmissionRepository } from './form-submission.repository';
import { Ugc } from '../ugc.entity';

import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';

import type { FormSubmissionOptions } from './form-submission.options';
import type { FormEdit } from '../form-edit/form-edit.entity';
import type { JSONObject } from '@okampus/shared/types';

@Entity({ customRepository: () => FormSubmissionRepository })
export class FormSubmission extends Ugc {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'FormEdit' })
  linkedFormEdit!: FormEdit;

  // @ManyToOne({ type: 'FormSubmissionEdit' })
  // lastEdit!: FormSubmissionEdit;
  // TODO: add edits

  constructor(options: FormSubmissionOptions) {
    super({ ...options, ugcKind: UgcKind.FormSubmission });
    this.assign({ ...options, ugcKind: UgcKind.FormSubmission });

    // this.lastEdit = new FormSubmissionEdit({
    //   addedDiff: options.submission,
    //   editedBy: options.realAuthor,
    //   linkedFormSubmission: this,
    //   order: 0,
    //   tenant: options.tenant,
    // });
  }
}
