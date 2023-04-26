import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { Form } from '../form.entity';
import type { FormEditOptions } from './form-edit.options';
import type { JSONObject } from '@okampus/shared/types';

@Entity()
export class FormEdit extends TenantScopedEntity {
  @Property({ type: 'json', nullable: true, default: null })
  addedDiff: JSONObject | null = null;

  @ManyToOne({ type: 'Form', onDelete: 'CASCADE' })
  form!: Form;

  @Property({ type: 'json' })
  newVersion!: JSONObject;

  constructor(options: FormEditOptions) {
    super(options);
    this.assign(options);
  }
}
