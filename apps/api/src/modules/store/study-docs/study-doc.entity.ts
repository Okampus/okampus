import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@meta/shared/lib/entities/base-file-entity';
import { StudyDocType } from '@meta/shared/lib/types/enums/study-doc-type.enum';
import { Subject } from '@modules/assort/subjects/subject.entity';
import type { Class } from '@modules/org/classes/class.entity';
import type { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class StudyDoc extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

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
    schoolGroup?: Class | null;
    flags?: number | null;
    docSeries?: DocSeries | null;
    description?: string | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
