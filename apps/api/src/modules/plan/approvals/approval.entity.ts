import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '@lib/entities/base.entity';
import { Event } from '@plan/events/event.entity';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import { User } from '@uaa/users/user.entity';

@Entity()
export class EventApproval extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ cascade: [Cascade.ALL] })
  event!: Event;

  @ManyToOne()
  user!: User;

  @Property({ type: 'text' })
  message: string | null = null;

  @Property({ type: 'text' })
  reason: string | null = null;

  @Property()
  approved!: boolean;

  @ManyToOne({ cascade: [Cascade.ALL] })
  step!: ApprovalStep;

  constructor(options: {
    event: Event;
    user: User;
    approved: boolean;
    step: ApprovalStep;
    message?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
