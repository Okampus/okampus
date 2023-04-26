import { TenantScopedEntity } from '../..';
import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { Individual } from '../../individual/individual.entity';
import type { EventApprovalStepOptions } from './event-approval-step.options';

@Entity()
export class EventApprovalStep extends TenantScopedEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'number' })
  stepOrder!: number;

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  validators = new Collection<Individual>(this);

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  notifiees = new Collection<Individual>(this);

  constructor(options: EventApprovalStepOptions) {
    super(options);
    this.assign(options);
  }
}
