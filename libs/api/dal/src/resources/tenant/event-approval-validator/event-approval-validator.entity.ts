import { EventApprovalValidatorRepository } from './event-approval-validator.repository';
import { TenantScopedHiddableEntity } from '../..';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { EventApprovalValidatorOptions } from './event-approval-validator.options';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { User } from '../../user/user.entity';

@Entity({ customRepository: () => EventApprovalValidatorRepository })
export class EventApprovalValidator extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: EventApprovalValidatorRepository;

  @ManyToOne({ type: 'EventApprovalStep' })
  step!: EventApprovalStep;

  @ManyToOne({ type: 'User' })
  user!: User;

  @Property({ type: 'boolean', default: false })
  canValidate = false;

  @Property({ type: 'boolean', default: false })
  isNotified = false;

  constructor(options: EventApprovalValidatorOptions) {
    super(options);
    this.assign(options);
  }
}
