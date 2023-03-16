import { FormEditRepository } from './form-edit.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { JSONObject } from '@okampus/shared/types';
import type { FormEditOptions } from './form-edit.options';
import type { Form } from '../form/form.entity';
import type { Individual } from '../../actor/individual/individual.entity';

@Entity({ customRepository: () => FormEditRepository })
export class FormEdit extends TenantScopedEntity {
  @Property({ type: 'json' })
  addedDiff!: JSONObject;

  @Property({ type: 'json' })
  newVersion!: JSONObject;

  @Property({ type: 'smallint' })
  order!: number;

  @ManyToOne({ type: 'Form', onDelete: 'CASCADE' })
  linkedForm!: Form;

  @ManyToOne({ type: 'Individual', nullable: true, onDelete: 'CASCADE' })
  editedBy!: Individual | null;

  constructor(options: FormEditOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
