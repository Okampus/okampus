import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { TEAM_CONTACTS_INCLUDED } from '../../shared/lib/constants';
import { Team } from '../../teams/entities/team.entity';
import { ContactAccount } from './contact-account.entity';
import type { Contact } from './contact.entity';

@Entity({ discriminatorValue: 'team' })
export class TeamContactAccount extends ContactAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Expose({ groups: [TEAM_CONTACTS_INCLUDED] })
  @Index()
  team!: Team;

  constructor(options: {
    contact: Contact;
    link?: string;
    pseudo: string;
    team: Team;
  }) {
    super(options);
    this.team = options.team;
  }
}
