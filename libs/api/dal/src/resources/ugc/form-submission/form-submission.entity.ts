import { FormSubmissionRepository } from './form-submission.repository';
import { Ugc } from '../ugc.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import type { JSONObject } from '@okampus/shared/types';
import type { FormSubmissionOptions } from './form-submission.options';
import type { FormEdit } from '../form-edit/form-edit.entity';
import type { FormSubmissionEdit } from '../form-submission-edit/form-submission-edit.entity';

@Entity({ customRepository: () => FormSubmissionRepository })
export class FormSubmission extends Ugc {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'FormEdit' })
  linkedFormVersion!: FormEdit;

  @ManyToOne({ type: 'FormSubmissionEdit' })
  lastEdit?: FormSubmissionEdit;
  // TODO: add lastEdit

  constructor(options: FormSubmissionOptions) {
    super({ ...options, ugcKind: UgcKind.FormSubmission });
    this.assign({ ...options, ugcKind: UgcKind.FormSubmission });
  }
}
