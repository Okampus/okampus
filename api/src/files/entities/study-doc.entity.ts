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
import { Subject } from '../../subjects/subject.entity';
import type { Tag } from '../../tags/tag.entity';
import { DocSeries } from './doc-series.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class StudyDoc extends BaseEntity {
  @PrimaryKey()
  studyDocId!: number;

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  subject!: Subject;

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

  constructor(options: {
    file: FileUpload;
    subject: Subject;
    docSeries?: DocSeries | null;
    name?: string;
    year?: number;
    description?: string;
  }) {
    super();
    this.file = options.file;
    this.subject = options.subject;
    if (options.docSeries)
      this.docSeries = options.docSeries;
    if (options.name)
      this.name = options.name;
    if (options.year)
      this.year = options.year;
    if (options.description)
      this.description = options.description;
  }
}
