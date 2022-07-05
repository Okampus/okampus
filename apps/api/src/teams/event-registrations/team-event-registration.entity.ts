import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { RegisterStatus } from '../../shared/lib/types/enums/register-status.enum';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import type { TeamForm } from '../forms/team-form.entity';

@Entity()
export class TeamEventRegistration extends BaseEntity {
  @PrimaryKey()
  teamEventRegistrationId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  event!: TeamEvent;

  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Enum(() => RegisterStatus)
  status!: RegisterStatus;

  @ManyToOne()
  originalForm?: TeamForm | null;

  @Property({ type: 'json' })
  formSubmission?: object | null;

  constructor(options: {
    event: TeamEvent;
    user: User;
    status: RegisterStatus;
    originalForm?: TeamForm | null;
    formSubmission?: object | null;
  }) {
    super();
    this.event = options.event;
    this.user = options.user;
    this.status = options.status;

    if (options.originalForm)
      this.originalForm = options.originalForm;
    if (options.formSubmission)
      this.formSubmission = options.formSubmission;
  }
}
