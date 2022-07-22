import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { User } from '../../users/user.entity';
import { ContactAccount } from './contact-account.entity';
import type { Contact } from './contact.entity';

@Entity({ discriminatorValue: 'user' })
export class UserContactAccount extends ContactAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  constructor(options: {
    contact: Contact;
    pseudo: string;
    user: User;
    link?: string | null;
  }) {
    super(options);
    this.assign(options);
  }
}
