import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { JSONObject } from '@okampus/shared/types';
import type { FormEditOptions } from './form-edit.options';
import type { Form } from '../form/form.entity';
import type { Individual } from '../../actor/individual/individual.entity';

@Entity()
export class FormEdit extends TenantScopedEntity {
  @Property({ type: 'json' })
  addedDiff!: JSONObject;

  @Property({ type: 'smallint' })
  order!: number;

  @ManyToOne({ type: 'Form', onDelete: 'CASCADE' })
  linkedForm!: Form;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  editedBy!: Individual;

  constructor(options: FormEditOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
