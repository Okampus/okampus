import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Expose } from 'class-transformer';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Club } from '../../clubs/entities/club.entity';
import { CLUB_CONTACTS_INCLUDED } from '../../shared/lib/constants';
import { ContactAccount } from './contact-account.entity';
import type { Contact } from './contact.entity';

@Entity({ discriminatorValue: 'club' })
export class ClubContactAccount extends ContactAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Expose({ groups: [CLUB_CONTACTS_INCLUDED] })
  @Index()
  club!: Club;

  constructor(options: {
    contact: Contact;
    link?: string;
    pseudo: string;
    club: Club;
  }) {
    super(options);
    this.club = options.club;
  }
}
