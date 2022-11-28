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
import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '@common/lib/entities/content-master.entity';
import { ContentMasterType } from '@common/lib/types/enums/content-master-type.enum';
import { ThreadType } from '@common/lib/types/enums/thread-type.enum';
import { Validation } from '@modules/interact/validations/validation.entity';
import { Class } from '@modules/org/classes/class.entity';
import { Team } from '@modules/org/teams/team.entity';
import { User } from '@modules/uaa/users/user.entity';
import type { Content } from '../contents/entities/content.entity';

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
