import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';

@Entity()
export class Subject extends BaseEntity {
  @PrimaryKey()
  subjectId!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName!: string;

  @Property({ type: 'text' })
  description?: string;

  constructor(options: {
    subjectId: string;
    name: string;
    englishName: string;
    description?: string;
  }) {
    super();
    this.subjectId = options.subjectId;
    this.name = options.name;
    this.englishName = options.englishName;
    if (options.description)
      this.description = options.description;
  }
}
