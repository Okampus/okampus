import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class InfoDoc extends BaseEntity {
  @PrimaryKey()
  infoDocId: string = nanoid(32);

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  docSeries?: DocSeries;

  // School year corresponding to the document; e.g. 2017 -> 2017-18, 2018 -> 2018-19, etc.
  @Property()
  year?: number;

  @Property({ type: 'text' })
  description?: string;

  // Whether the info of an infoDoc is now invalid (the document now acts as an archive or latest known infoDoc)
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete = false;

  constructor(options: {
    file: FileUpload;
    docSeries?: DocSeries | null;
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
    if (options.description)
      this.description = options.description;
    if (options.isObsolete)
      this.isObsolete = options.isObsolete;
  }
}
