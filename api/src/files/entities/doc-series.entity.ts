import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude, Transform } from 'class-transformer';
import type { Tag } from '../../tags/tag.entity';

@Entity()
export class DocSeries {
  @PrimaryKey()
  docSeriesId!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName!: string;

  @Property({ type: 'text' })
  description?: string;

  @ManyToMany()
  @Transform(({ obj: docSeries }: { obj: DocSeries }) => {
    if (docSeries.tags.isInitialized())
      return Object.values(docSeries.tags).filter(tag => typeof tag === 'object');
    return null; // In case the 'post.tags' field was not populated
  })
  tags = new Collection<Tag>(this);

  @Property()
  @Exclude()
  createdAt: Date = new Date();

  // Whether all the docs within the docs series are obsolete
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete?: boolean;

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt: Date = new Date();

  constructor(options: {
    name: string;
    englishName: string;
    description?: string;
    isObsolete?: boolean;
  }) {
    this.name = options.name;
    this.englishName = options.englishName;

    if (options.description)
      this.description = options.description;
    if (options.isObsolete)
      this.isObsolete = options.isObsolete;
  }
}
