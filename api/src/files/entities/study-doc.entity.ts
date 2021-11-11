import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude, Transform } from 'class-transformer';
import { Subject } from '../../subjects/subject.entity';
import type { Tag } from '../../tags/tag.entity';
import { DocSeries } from './doc-series.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class StudyDoc {
  @PrimaryKey()
  studyDocId!: number;

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  subject!: Subject;

  @ManyToOne()
  docSeries?: DocSeries;

  @ManyToMany()
  @Transform(({ obj: studyDoc }: { obj: StudyDoc }) => {
    if (studyDoc.tags.isInitialized())
      return Object.values(studyDoc.tags).filter(tag => typeof tag === 'object');
    return null; // In case the 'post.tags' field was not populated
  })
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name?: string;

  // School year corresponding to the document; e.g. 2017 -> 2017-18, 2018 -> 2018-19, etc.
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
    subject: Subject;
    docSeries?: DocSeries | null;
    name?: string;
    year?: number;
    description?: string;
  }) {
    this.file = options.file;
    this.subject = options.subject;
    if (options.docSeries)
      this.docSeries = options.docSeries;
    if (options.name)
      this.name = options.name;
    if (options.year)
      this.year = options.year;
    if (options.description)
      this.description = options.description;
  }
}
