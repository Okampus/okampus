import { FormEditRepository } from './form-edit.repository';
import { Edit } from '../edit.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormEditOptions } from './form-edit.options';
import type { Individual } from '../../actor/individual/individual.entity';

@Entity({ customRepository: () => FormEditRepository })
export class FormEdit extends Edit {
  @Property({ type: 'json' })
  newVersion!: JSONObject;

  @ManyToOne({ type: 'Individual', nullable: true, onDelete: 'CASCADE' })
  editedBy!: Individual | null;

  constructor(options: FormEditOptions) {
    super({ ...options, editKind: EditKind.FormEdit });
    this.assign({ ...options, editKind: EditKind.FormEdit });
  }
}
