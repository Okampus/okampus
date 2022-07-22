import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { SchoolYear } from '../shared/lib/types/enums/school-year.enum';

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

  @Enum(() => SchoolYear)
  schoolYear!: SchoolYear;

  constructor(options: {
    name: string;
    englishName: string;
    schoolYear: SchoolYear;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
