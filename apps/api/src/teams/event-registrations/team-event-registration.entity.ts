import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { RegisterStatus } from '../../shared/lib/types/enums/register-status.enum';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';

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

  constructor(options: {
    event: TeamEvent;
    user: User;
    status: RegisterStatus;
  }) {
    super();
    this.event = options.event;
    this.user = options.user;
    this.status = options.status;
  }
}
