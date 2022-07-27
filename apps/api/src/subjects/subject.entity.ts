import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { SchoolGroup } from '../school-group/school-group.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';

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

  @ManyToOne(() => SchoolGroup)
  schoolGroup: SchoolGroup | null = null;

  @Property()
  active = true;

  constructor(options: {
    name: string;
    englishName: string;
    schoolGroup: SchoolGroup | null;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
