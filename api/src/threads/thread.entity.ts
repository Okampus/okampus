import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import type { Content } from '../contents/content.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../shared/lib/types/content-master-type.enum';
import { ThreadType } from '../shared/lib/types/thread-type.enum';
import type { User } from '../users/user.entity';

@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Property({ type: 'text' })
  title!: string;

  @Enum(() => ThreadType)
  type!: ThreadType;

  // TODO: Add full 'locked' support - Add perms to Update/Patch endpoint
  @Property()
  locked = false;

  // TODO: Add full 'opened' support - Add perms to Update/Patch endpoint
  @Property()
  opened = true;

  // TODO: Add full 'solved' support - Add perms to Update/Patch endpoint
  @Property()
  solved = false;

  @ManyToMany()
  @TransformCollection()
  assignees = new Collection<User>(this);

  @Property()
  archived = false;

  constructor(options: {
    title: string;
    post?: Content;
    type: ThreadType;
  }) {
    super(options);
    this.title = options.title;
    this.type = options.type;
  }
}
