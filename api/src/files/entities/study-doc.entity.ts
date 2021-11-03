import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { CourseSubject } from './course-subject.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class StudyDoc {
  @PrimaryKey()
  studyDocId!: number;

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  subject!: CourseSubject;

  @Property()
  tags: string[] = [];

  @Property({ type: 'text' })
  name?: string;

  @Property()
  year?: number;

  @Property({ type: 'text' })
  description?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();

  constructor(options: {
    file: FileUpload;
    subject: CourseSubject;
    tags?: string[];
    name?: string;
    year?: number;
    description?: string;
  }) {
    this.file = options.file;
    this.subject = options.subject;
    if (options.tags)
      this.tags = options.tags;
    if (options.name)
      this.name = options.name;
    if (options.year)
      this.year = options.year;
    if (options.description)
      this.description = options.description;
  }
}
