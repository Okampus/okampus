import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
export class CourseSubject {
  @PrimaryKey()
  courseSubjectId!: number;

  @Property()
  @Unique()
  @Index()
  courseCode!: string;

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
    courseCode: string;
    name: string;
    englishName: string;
    description?: string;
  }) {
    this.courseCode = options.courseCode;
    this.name = options.name;
    this.englishName = options.englishName;

    if (options.description)
      this.description = options.description;
  }
}
