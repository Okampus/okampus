import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { User } from '@modules/uaa/users/user.entity';
import { Event } from '../events/event.entity';

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
