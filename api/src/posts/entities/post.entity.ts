import {
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  EventArgs,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { Content } from '../../shared/lib/entities/content.entity';
import { PostType } from '../../shared/lib/types/post-type.enum';
import type { Tag } from '../../tags/tag.entity';
import type { User } from '../../users/user.entity';

@Entity()
export class Post extends Content {
  @PrimaryKey()
  postId!: number;

  @Property({ type: 'text' })
  title!: string;

  @ManyToMany()
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Enum()
  type!: PostType;

  // TODO: Add full 'locked' support - Add perms to Update/Patch endpoint
  @Property()
  locked = false;

  // TODO: Add full 'opened' support - Add perms to Update/Patch endpoint
  @Property()
  opened = true;

  // TODO: Add full 'solved' support - Add perms to Update/Patch endpoint
  @Property()
  solved = false;

  @Property()
  downvotes = 0;

  @ManyToMany()
  @TransformCollection()
  assignees = new Collection<User>(this);

  constructor(options: {
    title: string;
    body: string;
    type: PostType;
    author: User;
  }) {
    super(options);
    this.title = options.title;
    this.type = options.type;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('title' in payload || 'body' in payload))
      this.contentLastUpdatedAt = new Date();
  }
}
