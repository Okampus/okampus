import {
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransformTags } from '../../shared/lib/decorators/transform-tags.decorator';
import { Content } from '../../shared/lib/entities/content.entity';
import type { Tag } from '../../tags/tag.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Article extends Content {
  @PrimaryKey()
  articleId!: number;

  @Property({ type: 'text' })
  title!: string;

  @ManyToMany()
  @TransformTags()
  tags = new Collection<Tag>(this);


  // TODO: Add full 'locked' support - Add perms to Update/Patch endpoint
  @Property()
  locked = false;

  // TODO: Add full 'opened' support - Add perms to Update/Patch endpoint
  @Property()
  opened = true;

  // TODO: Add full 'solved' support - Add perms to Update/Patch endpoint
  @Property()
  solved = false;

  // TODO: Add full 'views' support - Auto-increment when a post is viewed
  @Property()
  views = 0;

  // TODO: Add full 'favorites' support - Create entity and CRUD + Increment when a favorite is created
  @Property()
  favorites = 0;

  @Property()
  downvotes = 0;

  constructor(options: {
    title: string;
    body: string;
    author: User;
    slug: string;
    category: string;
    isDraft: boolean;
    tags: string[];
    location?: string;
    locationName?: string;
  }) {
    super(options);
    this.title = options.title;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('title' in payload || 'body' in payload))
      this.contentLastUpdatedAt = new Date();
  }
}
