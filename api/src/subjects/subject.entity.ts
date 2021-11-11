import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
export class Subject {
  @PrimaryKey()
  subjectId!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName!: string;

  @Property({ type: 'text' })
  description?: string;

  @Property()
  @Exclude()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt: Date = new Date();

  constructor(options: {
    subjectId: string;
    name: string;
    englishName: string;
    description?: string;
  }) {
    this.subjectId = options.subjectId;
    this.name = options.name;
    this.englishName = options.englishName;
    if (options.description)
      this.description = options.description;
  }
}
