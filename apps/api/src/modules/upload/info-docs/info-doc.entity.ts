import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@common/lib/entities/base-file.entity';
import { Class } from '@modules/org/classes/class.entity';
import type { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class InfoDoc extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @ManyToOne({ onDelete: 'CASCADE' })
  docSeries: DocSeries | null = null;

  @Property()
  year!: number;

  @ManyToOne(() => Class)
  schoolClass: Class | null = null;

  @Property({ type: 'text' })
  description: string | null = null;

  // Whether the info of an infoDoc is now invalid (the document now acts as an archive or latest known infoDoc)
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete = false;

  constructor(options: {
    file: FileUpload;
    year: number;
    schoolClass?: Class | null;
    docSeries?: DocSeries | null;
    description?: string | null;
    isObsolete?: boolean | null;
  }) {
    super();
    this.assign(options);
  }
}