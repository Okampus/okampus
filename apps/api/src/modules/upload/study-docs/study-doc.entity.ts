import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Subject } from '@catalog/subjects/subject.entity';
import type { Class } from '@classes/class.entity';
import { BaseFileEntity } from '@lib/entities/base-file.entity';
import { StudyDocType } from '@lib/types/enums/study-doc-type.enum';
import type { DocSeries } from '@upload/doc-series/doc-series.entity';
import type { FileUpload } from '@upload/file-uploads/file-upload.entity';

@Entity()
export class StudyDoc extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @ManyToOne()
  subject!: Subject;

  @ManyToOne({ type: 'DocSeries', onDelete: 'CASCADE' })
  docSeries: DocSeries | null = null;

  @Property()
  year!: number;

  @Property({ type: 'text' })
  description: string | null = null;

  @Enum(() => StudyDocType)
  type!: StudyDocType;

  @Property({ type: 'smallint' })
  flags = 0;

  constructor(options: {
    file: FileUpload;
    subject: Subject;
    type: StudyDocType;
    year: number;
    schoolClass?: Class | null;
    flags?: number | null;
    docSeries?: DocSeries | null;
    description?: string | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
