import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import type { Tag } from '@catalog/tags/tag.entity';
import { TransformCollection } from '@lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@lib/entities/base.entity';

@Entity()
export class DocSeries extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  englishName: string | null = null;

  @Property({ type: 'text' })
  description: string | null = null;

  @ManyToMany()
  @TransformCollection()
  tags = new Collection<Tag>(this);

  // Whether all the docs within the docs series are obsolete
  @Property()
  isObsolete = false;

  constructor(options: {
    name: string;
    englishName?: string | null;
    description?: string | null;
    isObsolete?: boolean | null;
  }) {
    super();
    this.assign(options);
  }
}
