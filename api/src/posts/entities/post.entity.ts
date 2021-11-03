import {
  BeforeUpdate,
  Entity,
  Enum,
  EventArgs,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { PostType } from '../../shared/types/post-type.enum';
import { User } from '../../users/user.entity';

@Entity()
export class Post {
  @PrimaryKey()
  postId: number;

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  body!: string;

  @Property()
  tags: string[] = [];

  @Enum()
  type!: PostType;

  @ManyToOne()
  author!: User;

  @Property()
  locked = false;

  @Property()
  opened = true;

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
    tags?: string[];
  }) {
    this.title = options.title;
    this.body = options.body;
    this.type = options.type;
    this.author = options.author;
    if (options.tags)
      this.tags = options.tags;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('title' in payload || 'body' in payload))
      this.contentLastUpdatedAt = new Date();
  }
}
