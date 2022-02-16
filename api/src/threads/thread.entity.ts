import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Transform } from 'class-transformer';
import type { Content } from '../contents/entities/content.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../shared/lib/types/content-master-type.enum';
import type { DeepPartial } from '../shared/lib/types/deep-partial.type';
import { ThreadType } from '../shared/lib/types/thread-type.enum';
import type { User } from '../users/user.entity';

const validatedContentTransformer = ({ value }: { value: Content }): DeepPartial<Content> | null => (value
  ? {
    contentId: value?.contentId,
    author: {
      userId: value?.author?.userId,
      fullname: value?.author?.fullname,
    },
  }
  : null);

@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Property({ type: 'text' })
  title!: string;

  @Enum(() => ThreadType)
  type!: ThreadType;

  @Property()
  locked = false;

  @OneToOne()
  @Transform(validatedContentTransformer)
  opValidatedWith?: Content | null = null;

  @OneToOne()
  @Transform(validatedContentTransformer)
  adminValidatedWith?: Content | null = null;

  @ManyToOne()
  @Transform(({ value }: { value: User }) => (value ? { userId: value.userId, fullname: value.fullname } : null))
  adminValidatedBy?: User | null = null;

  @ManyToMany()
  @TransformCollection()
  assignees = new Collection<User>(this);

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
