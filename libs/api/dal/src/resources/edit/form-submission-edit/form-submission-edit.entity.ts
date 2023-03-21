import { Edit } from '../edit.entity';
import { Entity, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormSubmissionEditOptions } from './form-submission-edit.options';

@Entity()
export class FormSubmissionEdit extends Edit {
  @Property({ type: 'json' })
  newVersion!: JSONObject;

  constructor(options: FormSubmissionEditOptions) {
    super({ ...options, editKind: EditKind.FormSubmissionEdit });
    this.assign({ ...options, editKind: EditKind.FormSubmissionEdit });
  }
}
