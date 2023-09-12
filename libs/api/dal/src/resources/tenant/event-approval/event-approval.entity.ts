import { EventApprovalRepository } from './event-approval.repository';
import { TenantScopedHiddableEntity } from '../..';
import { Cascade, Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { Event } from '../../event/event.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { EventApprovalOptions } from './event-approval.options';

@Entity({ customRepository: () => EventApprovalRepository })
export class EventApproval extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: EventApprovalRepository;

  @Property({ type: 'text', default: '' })
  message = '';

  @Property({ type: 'boolean', default: true })
  isApproved = true;

  @ManyToOne({ type: 'Event', cascade: [Cascade.ALL] })
  event!: Event;

  @ManyToOne({ type: 'EventApprovalStep', cascade: [Cascade.ALL] })
  eventApprovalStep!: EventApprovalStep;

  constructor(options: EventApprovalOptions) {
    super(options);
    this.assign(options);
  }
}
