import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ValidationStep } from '@modules/org/tenants/validation-steps/validation-step.entity';
import { User } from '@modules/uua/users/user.entity';
import { TeamEvent } from '../events/team-event.entity';

@Entity()
export class TeamEventValidation extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  event!: TeamEvent;

  @ManyToOne()
  user!: User;

  @Property({ type: 'text' })
  message: string | null = null;

  @Property()
  approved!: boolean;

  @ManyToOne()
  step!: ValidationStep;

  constructor(options: {
    event: TeamEvent;
    user: User;
    approved: boolean;
    step: ValidationStep;
    message?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
