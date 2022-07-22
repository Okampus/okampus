import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamEventRegisterStatus } from '../../shared/lib/types/enums/team-event-register-status.enum';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import type { TeamForm } from '../forms/team-form.entity';

@Entity()
export class TeamEventRegistration extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  event!: TeamEvent;

  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Enum(() => TeamEventRegisterStatus)
  status!: TeamEventRegisterStatus;

  @Property()
  present = false;

  @Property()
  participationScore = 0;

  @ManyToOne()
  originalForm: TeamForm | null = null;

  @Property({ type: 'json' })
  formSubmission: object | null = null;

  constructor(options: {
    event: TeamEvent;
    user: User;
    status: TeamEventRegisterStatus;
    originalForm?: TeamForm | null;
    formSubmission?: object | null;
  }) {
    super();
    this.assign(options);
  }
}
