import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { Contact } from './contact.entity';


@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class ContactAccount extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Enum()
  kind!: 'team' | 'user';

  @ManyToOne({ onDelete: 'CASCADE' })
  contact!: Contact;

  @Property({ type: 'text' })
  link: string | null = null;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: {
    contact: Contact;
    pseudo: string;
    link?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
