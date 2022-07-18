import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { SchoolYear } from '../shared/lib/types/enums/school-year.enum';

@Entity()
export class Subject extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName!: string;

  @Property({ type: 'text' })
  description?: string;

  @Enum(() => SchoolYear)
  schoolYear!: SchoolYear;

  constructor(options: {
    id: string;
    name: string;
    englishName: string;
    schoolYear: SchoolYear;
    description?: string;
  }) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.englishName = options.englishName;
    this.schoolYear = options.schoolYear;
    if (options.description)
      this.description = options.description;
  }
}
