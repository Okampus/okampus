import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ValidationStep } from '../../configurations/validation-steps/validation-step.entity';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
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
