import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { TransformTags } from '../../shared/lib/decorators/transform-tags.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { Tag } from '../../tags/tag.entity';

@Entity()
export class DocSeries extends BaseEntity {
  @PrimaryKey()
  docSeriesId: string = nanoid(32);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName?: string;

  @Property({ type: 'text' })
  description?: string;

  @ManyToMany()
  @TransformTags()
  tags = new Collection<Tag>(this);

  // Whether all the docs within the docs series are obsolete
  // TODO: Changing the isObsolete property of any document should require a validation/signature
  @Property()
  isObsolete?: boolean;

  constructor(options: {
    name: string;
    englishName?: string;
    description?: string;
    isObsolete?: boolean;
  }) {
    super();
    this.name = options.name;

    if (options.englishName)
      this.englishName = options.englishName;
    if (options.description)
      this.description = options.description;
    if (options.isObsolete)
      this.isObsolete = options.isObsolete;
  }
}
