import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Class } from '@classes/class.entity';
import { BaseEntity } from '@lib/entities/base.entity';

@Entity()
export class Subject extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  @Unique()
  code!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName!: string;

  @Property({ type: 'text' })
  description: string | null = null;

  @ManyToOne(() => Class)
  schoolClass: Class | null = null;

  @Property()
  active = true;

  constructor(options: {
    name: string;
    englishName: string;
    schoolClass: Class | null;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
