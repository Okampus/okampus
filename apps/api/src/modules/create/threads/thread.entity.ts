import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Class } from '@classes/class.entity';
import { Paginated } from '@common/modules/pagination';
import type { Content } from '@create/contents/entities/content.entity';
import { Validation } from '@interact/validations/validation.entity';
import { TransformCollection } from '@lib/decorators/transform-collection.decorator';
import { ContentMaster } from '@lib/entities/content-master.entity';
import { ContentMasterType } from '@lib/types/enums/content-master-type.enum';
import { ThreadType } from '@lib/types/enums/thread-type.enum';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';

@ObjectType()
@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Field(() => ThreadType)
  @Enum(() => ThreadType)
  type!: ThreadType;

  @Field(() => Class, { nullable: true })
  @ManyToOne(() => Class)
  scope: Class | null = null;

  @Field(() => Boolean)
  @Property()
  locked = false;

  @Field(() => Validation, { nullable: true })
  @OneToOne({ type: Validation, nullable: true })
  opValidation: Validation | null = null;

  @Field(() => [Validation])
  @OneToMany(() => Validation, 'contentMaster')
  @TransformCollection()
  adminValidations = new Collection<Validation>(this);

  @Field(() => [Team])
  @ManyToMany()
  @TransformCollection()
  assignedTeams = new Collection<Team>(this);

  @Field(() => [User])
  @ManyToMany()
  @TransformCollection()
  assignedUsers = new Collection<User>(this);

  constructor(options: {
    title: string;
    post: Content;
    type: ThreadType;
  }) {
    super(options);
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedThread extends Paginated(Thread) {}
