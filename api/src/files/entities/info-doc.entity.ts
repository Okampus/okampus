import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransformTags } from '../../shared/lib/decorators/transform-tags.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { Tag } from '../../tags/tag.entity';
import { DocSeries } from './doc-series.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class InfoDoc extends BaseEntity {
  @PrimaryKey()
  infoDocId!: number;

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  docSeries?: DocSeries;

  @ManyToMany()
  @TransformTags()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name?: string;

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
    name?: string;
    year?: number;
    description?: string;
    isObsolete?: boolean;
  }) {
    super();
    this.file = options.file;
    if (options.docSeries)
      this.docSeries = options.docSeries;
    if (options.name)
      this.name = options.name;
    if (options.year)
      this.year = options.year;
    if (options.description)
      this.description = options.description;
    if (options.isObsolete)
      this.isObsolete = options.isObsolete;
  }
}
