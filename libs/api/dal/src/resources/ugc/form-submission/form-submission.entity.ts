import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import { JSONObject } from '@okampus/shared/types';
import { Ugc } from '../ugc.entity';
import { FormSubmissionOptions } from './form-submission.options';
import { Form } from '../form/form.entity';
// eslint-disable-next-line import/no-cycle
import { FormSubmissionRepository } from './form-submission.repository';

@Entity({
  customRepository: () => FormSubmissionRepository,
})
export class FormSubmission extends Ugc {
  @Property({ type: 'json' })
  submission!: JSONObject;

  @ManyToOne({ type: 'Form' })
  forForm!: Form;

  constructor(options: FormSubmissionOptions) {
    super({ ...options, ugcKind: UgcKind.FormSubmission });
    this.assign({ ...options, ugcKind: UgcKind.FormSubmission });
  }
}
