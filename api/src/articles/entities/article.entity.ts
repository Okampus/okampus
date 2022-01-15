import {
  ArrayType,
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { Content } from '../../shared/lib/entities/content.entity';
import type { Tag } from '../../tags/tag.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Article extends Content {
  @PrimaryKey()
  articleId!: number;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  category!: string;

  @Property({ type: 'text' })
  locationName?: string;

  @Property({ type: new ArrayType(i => Number(i)), nullable: true })
  location?: [lat: number, lon: number];

  @ManyToMany()
  @TransformCollection()
  tags = new Collection<Tag>(this);

  // TODO: Add full 'locked' support - Add perms to Update/Patch endpoint
  @Property()
  locked = false;

  // TODO: Add full 'draft' support
  @Property()
  isDraft = false;

  @Property()
  downvotes = 0;

  constructor(options: {
    title: string;
    body: string;
    author: User;
    slug: string;
    category: string;
    isDraft: boolean;
    location?: [lat: number, lon: number];
    locationName?: string;
  }) {
    super(options);
    this.title = options.title;
    this.slug = options.slug;
    this.category = options.category;
    this.isDraft = options.isDraft;
    if (options.location)
      this.location = options.location;
    if (options.locationName)
      this.locationName = options.locationName;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('title' in payload || 'body' in payload))
      this.contentLastUpdatedAt = new Date();
  }
}
