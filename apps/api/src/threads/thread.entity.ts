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
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';
import { ThreadType } from '../shared/lib/types/enums/thread-type.enum';
import type { DeepPartial } from '../shared/lib/types/types/deep-partial.type';
import type { User } from '../users/user.entity';

const validatedContentTransformer = ({ value }: { value: Content }): DeepPartial<Content> | null => (value
  ? {
    contentId: value?.contentId,
    author: {
      userId: value?.author?.userId,
      firstname: value?.author?.firstname,
      lastname: value?.author?.lastname,
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
  @Transform(({ value }: { value: User }) => (value
    ? { userId: value.userId, firstname: value.firstname, lastname: value.lastname }
    : null))
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
