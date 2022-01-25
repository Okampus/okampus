import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { Cursus } from '../../shared/lib/types/cursus.enum';
import { StudyDocType } from '../../shared/lib/types/study-doc-type.enum';
import { Subject } from '../../subjects/subject.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class StudyDoc extends BaseEntity {
  @PrimaryKey()
  studyDocId: string = nanoid(32);

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  subject!: Subject;

  @ManyToOne()
  docSeries?: DocSeries;

  @Property()
  year!: number;

  @Property({ type: 'text' })
  description?: string;

  @Enum(() => Cursus)
  cursus!: Cursus;

  @Enum(() => StudyDocType)
  type!: StudyDocType;

  constructor(options: {
    file: FileUpload;
    subject: Subject;
    cursus: Cursus;
    type: StudyDocType;
    docSeries?: DocSeries | null;
    year: number;
    description?: string;
  }) {
    super();
    this.file = options.file;
    this.subject = options.subject;
    this.cursus = options.cursus;
    this.type = options.type;
    this.year = options.year;
    if (options.docSeries)
      this.docSeries = options.docSeries;
    if (options.description)
      this.description = options.description;
  }
}
