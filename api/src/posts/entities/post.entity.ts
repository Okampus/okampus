import {
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  EventArgs,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude, Transform } from 'class-transformer';
import { PostType } from '../../shared/lib/types/post-type.enum';
import type { Tag } from '../../tags/tag.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Post {
  @PrimaryKey()
  postId!: number;

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  body!: string;

  @ManyToMany()
  @Transform(({ obj: post }: { obj: Post }) => {
    if (post.tags.isInitialized())
      return Object.values(post.tags).filter(tag => typeof tag === 'object');
    return null; // In case the 'post.tags' field was not populated
  })
  tags = new Collection<Tag>(this);

  // TODO: Add full 'type' support
  @Enum()
  type!: PostType;

  @ManyToOne()
  author!: User;

  // TODO: Add full 'locked' support
  @Property()
  locked = false;

  // TODO: Add full 'opened' support
  @Property()
  opened = true;

  // TODO: Add full 'solved' support
  @Property()
  solved = false;

  // TODO: Add full 'views' support
  @Property()
  views = 0;

  // TODO: Add full 'favorites' support
  @Property()
  favorites = 0;

  @Property()
  upvotes = 0;

  @Property()
  downvotes = 0;

  @Property()
  contentLastUpdatedAt = new Date();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();

  constructor(options: {
    title: string;
    body: string;
    type: PostType;
    author: User;
  }) {
    this.title = options.title;
    this.body = options.body;
    this.type = options.type;
    this.author = options.author;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('title' in payload || 'body' in payload))
      this.contentLastUpdatedAt = new Date();
  }
}
