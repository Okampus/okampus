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
import { SchoolYear } from '../../shared/lib/types/school-year.enum';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class InfoDoc extends BaseEntity {
  @PrimaryKey()
  infoDocId: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne({ onDelete: 'CASCADE' })
  docSeries?: DocSeries;

  @Property()
  year?: number;

  @Enum(() => SchoolYear)
  schoolYear?: SchoolYear;

  @Property({ type: 'text' })
  description?: string;

  // Whether the info of an infoDoc is now invalid (the document now acts as an archive or latest known infoDoc)
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete = false;

  constructor(options: {
    file: FileUpload;
    docSeries?: DocSeries | null;
    schoolYear?: number;
    year?: number;
    description?: string;
    isObsolete?: boolean;
  }) {
    super();
    this.file = options.file;
    if (options.docSeries)
      this.docSeries = options.docSeries;
    if (options.year)
      this.year = options.year;
    if (options.schoolYear)
      this.schoolYear = options.schoolYear;
    if (options.description)
      this.description = options.description;
    if (options.isObsolete)
      this.isObsolete = options.isObsolete;
  }
}
