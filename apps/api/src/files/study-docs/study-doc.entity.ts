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
import { Cursus } from '../../shared/lib/types/enums/cursus.enum';
import { StudyDocType } from '../../shared/lib/types/enums/study-doc-type.enum';
import { Subject } from '../../subjects/subject.entity';
import type { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class StudyDoc extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne()
  subject!: Subject;

  @ManyToOne({ onDelete: 'CASCADE' })
  docSeries: DocSeries | null = null;

  @Property()
  year!: number;

  @Property({ type: 'text' })
  description: string | null = null;

  @Enum(() => Cursus)
  cursus!: Cursus;

  @Enum(() => StudyDocType)
  type!: StudyDocType;

  @Property({ type: 'smallint' })
  flags = 0;

  constructor(options: {
    file: FileUpload;
    subject: Subject;
    cursus: Cursus;
    type: StudyDocType;
    year: number;
    flags?: number | null;
    docSeries?: DocSeries | null;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
