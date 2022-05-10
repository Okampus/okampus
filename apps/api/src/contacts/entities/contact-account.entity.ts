import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { Contact } from './contact.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class ContactAccount extends BaseEntity {
  @PrimaryKey()
  contactAccountId!: number;

  @Enum()
  @Exclude()
  kind!: 'team' | 'user';

  @ManyToOne({ onDelete: 'CASCADE' })
  contact!: Contact;

  @Property({ type: 'text' })
  link?: string;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: {
    contact: Contact;
    link?: string;
    pseudo: string;
  }) {
    super();
    this.contact = options.contact;
    this.link = options.link;
    this.pseudo = options.pseudo;
  }
}
