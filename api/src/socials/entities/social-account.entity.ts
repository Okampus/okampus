import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { Social } from './social.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class SocialAccount extends BaseEntity {
  @PrimaryKey()
  socialAccountId!: number;

  @Enum()
  @Exclude()
  kind!: 'club' | 'user';

  @ManyToOne({ onDelete: 'CASCADE' })
  social!: Social;

  @Property({ type: 'text' })
  link?: string;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: {
    social: Social;
    link?: string;
    pseudo: string;
  }) {
    super();
    this.social = options.social;
    this.link = options.link;
    this.pseudo = options.pseudo;
  }
}
