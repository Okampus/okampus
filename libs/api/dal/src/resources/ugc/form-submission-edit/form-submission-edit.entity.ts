import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { JSONObject } from '@okampus/shared/types';
import { FormSubmissionEditOptions } from './form-submission-edit.options';
import { FormSubmission } from '../form-submission/form-submission.entity';
import { Individual } from '../../actor/individual/individual.entity';

@Entity()
export class FormSubmissionEdit extends TenantScopedEntity {
  @Property({ type: 'json' })
  addedDiff!: JSONObject;

  @Property({ type: 'smallint' })
  order!: number;

  @ManyToOne({ type: 'FormSubmission', onDelete: 'CASCADE' })
  formSubmission!: FormSubmission;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  editedBy!: Individual;

  constructor(options: FormSubmissionEditOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
