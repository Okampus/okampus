import {
  ArrayType,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';

@Entity()
export class Club extends BaseEntity {
  @PrimaryKey()
  clubId!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  category!: string;

  @Property({ type: 'text' })
  description!: string;

  // TODO: Full 'icon' support
  @Property({ type: 'text' })
  icon!: string;

  @Property({ type: ArrayType })
  socials!: string[];

  @Property()
  membersCount = 0;

  constructor(options: {
    name: string;
    category: string;
    description: string;
    icon: string;
    socials: string[];
  }) {
    super();
    this.name = options.name;
    this.category = options.category;
    this.description = options.description;
    this.icon = options.icon;
    this.socials = options.socials;
  }
}
