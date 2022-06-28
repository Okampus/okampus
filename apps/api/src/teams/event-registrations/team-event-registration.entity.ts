import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
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

  constructor(options: { event: TeamEvent; user: User }) {
    super();
    this.event = options.event;
    this.user = options.user;
  }
}
