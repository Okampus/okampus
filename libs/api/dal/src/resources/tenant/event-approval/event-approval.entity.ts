import { TenantScopedEntity } from '../..';
import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { Event } from '../../event/event.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { EventApprovalOptions } from './event-approval.options';

@Entity()
export class EventApproval extends TenantScopedEntity {
  @Property({ type: 'text', nullable: true, default: null })
  message: string | null = null;

  @Property({ type: 'boolean' })
  approved!: boolean;

  @ManyToOne({ type: 'Event', cascade: [Cascade.ALL] })
  event!: Event;

  @ManyToOne({ type: 'EventApprovalStep', cascade: [Cascade.ALL] })
  step!: EventApprovalStep;

  constructor(options: EventApprovalOptions) {
    super(options);
    this.assign(options);
  }
}
