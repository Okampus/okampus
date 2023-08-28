import { EventApprovalStepRepository } from './event-approval-step.repository';
import { TenantScopedEntity } from '../..';
import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { User } from '../../user/user.entity';
import type { EventApprovalStepOptions } from './event-approval-step.options';

@Entity({ customRepository: () => EventApprovalStepRepository })
export class EventApprovalStep extends TenantScopedEntity {
  [EntityRepositoryType]!: EventApprovalStepRepository;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'int' })
  order!: number;

  @Property({ type: 'string', default: '' })
  description = '';

  @ManyToMany({ type: 'User' })
  @TransformCollection()
  validators = new Collection<User>(this);

  @ManyToMany({ type: 'User' })
  @TransformCollection()
  notifiees = new Collection<User>(this);

  @OneToMany({ type: 'EventApprovalStep', mappedBy: 'previousStep' })
  @TransformCollection()
  nextSteps = new Collection<EventApprovalStep>(this);

  @ManyToOne({ type: 'EventApprovalStep', nullable: true, default: null })
  previousStep: EventApprovalStep | null = null;

  constructor(options: EventApprovalStepOptions) {
    super(options);
    this.assign(options);
  }
}
