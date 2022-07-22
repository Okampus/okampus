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
    pseudo: string;
    team: Team;
    link?: string | null;
  }) {
    super(options);
    this.assign(options);
  }
}
