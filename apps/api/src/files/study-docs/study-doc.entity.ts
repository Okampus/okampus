import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import type { SchoolGroup } from '../../school-group/school-group.entity';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { StudyDocType } from '../../shared/lib/types/enums/study-doc-type.enum';
import { Subject } from '../../subjects/subject.entity';
import type { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class StudyDoc extends BaseFileEntity {
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

  @Enum(() => StudyDocType)
  type!: StudyDocType;

  @Property({ type: 'smallint' })
  flags = 0;

  constructor(options: {
    file: FileUpload;
    subject: Subject;
    type: StudyDocType;
    year: number;
    schoolGroup?: SchoolGroup | null;
    flags?: number | null;
    docSeries?: DocSeries | null;
    description?: string | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
