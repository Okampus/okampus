import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Content } from '../contents/entities/content.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';
import { ThreadType } from '../shared/lib/types/enums/thread-type.enum';
import type { DeepPartial } from '../shared/lib/types/types/deep-partial.type';
import { User } from '../users/user.entity';

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

@ObjectType()
@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Field(() => ThreadType)
  @Enum(() => ThreadType)
  type!: ThreadType;

  @Field(() => Boolean)
  @Property()
  locked = false;

  @Field(() => Content, { nullable: true })
  @OneToOne()
  @Transform(validatedContentTransformer)
  opValidatedWith?: Content | null = null;

  @Field(() => Content, { nullable: true })
  @OneToOne()
  @Transform(validatedContentTransformer)
  adminValidatedWith?: Content | null = null;

  @Field(() => User, { nullable: true })
  @ManyToOne()
  @Transform(({ value }: { value: User }) => (value
    ? { userId: value.userId, firstname: value.firstname, lastname: value.lastname }
    : null))
  adminValidatedBy?: User | null = null;

  @Field(() => [User])
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
