import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Team } from '../../teams/teams/team.entity';
import { ContactAccount } from './contact-account.entity';
import type { Contact } from './contact.entity';

@Entity({ discriminatorValue: 'team' })
export class TeamContactAccount extends ContactAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
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
