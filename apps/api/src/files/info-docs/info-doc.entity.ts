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
import { SchoolYear } from '../../shared/lib/types/enums/school-year.enum';
import type { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class InfoDoc extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne({ onDelete: 'CASCADE' })
  docSeries: DocSeries | null = null;

  @Property()
  year!: number;

  @Enum(() => SchoolYear)
  schoolYear: SchoolYear | null = null;

  @Property({ type: 'text' })
  description: string | null = null;

  // Whether the info of an infoDoc is now invalid (the document now acts as an archive or latest known infoDoc)
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete = false;

  constructor(options: {
    file: FileUpload;
    year: number;
    docSeries?: DocSeries | null;
    schoolYear?: number | null;
    description?: string | null;
    isObsolete?: boolean | null;
  }) {
    super();
    this.assign(options);
  }
}
