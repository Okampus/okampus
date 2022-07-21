import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import type { Content } from '../contents/entities/content.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';
import { ThreadType } from '../shared/lib/types/enums/thread-type.enum';
import { User } from '../users/user.entity';
import { Validation } from '../validations/validation.entity';

@ObjectType()
@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Field(() => ThreadType)
  @Enum(() => ThreadType)
  type!: ThreadType;

  @Field(() => Boolean)
  @Property()
  locked = false;

  @Field(() => Validation, { nullable: true })
  @OneToOne()
  opValidation?: Validation | null = null;

  @Field(() => [Validation])
  @OneToMany('Validation', 'contentMaster')
  @TransformCollection()
  adminValidations = new Collection<Validation>(this);

  @Field(() => [User])
  @ManyToMany()
  @TransformCollection()
  assignees = new Collection<User>(this);

  constructor(options: {
    title: string;
    post: Content;
    type: ThreadType;
  }) {
    super(options);
    this.title = options.title;
    this.type = options.type;
  }
}
