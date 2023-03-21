import { Edit } from '../edit.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormSubmissionEditOptions } from './form-submission-edit.options';
import type { Individual } from '../../actor/individual/individual.entity';

@Entity()
export class FormSubmissionEdit extends Edit {
  @Property({ type: 'json' })
  newVersion!: JSONObject;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  editedBy!: Individual;

  constructor(options: FormSubmissionEditOptions) {
    super({ ...options, editKind: EditKind.FormSubmissionEdit });
    this.assign({ ...options, editKind: EditKind.FormSubmissionEdit });
  }
}
