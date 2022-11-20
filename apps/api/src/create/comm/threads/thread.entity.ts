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
import { SchoolGroup } from '../../../org/school-group/school-group.entity';
import { Team } from '../../../org/teams/teams/team.entity';
import { TransformCollection } from '../../../shared/lib/decorators/transform-collection.decorator';
import { ContentMaster } from '../../../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../../../shared/lib/types/enums/content-master-type.enum';
import { ThreadType } from '../../../shared/lib/types/enums/thread-type.enum';
import { User } from '../../../uua/users/user.entity';
import { Validation } from '../../../validations/validation.entity';
import type { Content } from '../../contents/entities/content.entity';

@ObjectType()
@Entity({ discriminatorValue: ContentMasterType.Thread })
export class Thread extends ContentMaster {
  @Field(() => ThreadType)
  @Enum(() => ThreadType)
  type!: ThreadType;

  @Field(() => SchoolGroup, { nullable: true })
  @ManyToOne(() => SchoolGroup)
  scope: SchoolGroup | null = null;

  @Field(() => Boolean)
  @Property()
  locked = false;

  @Field(() => Validation, { nullable: true })
  @OneToOne()
  opValidation: Validation | null = null;

  @Field(() => [Validation])
  @OneToMany('Validation', 'contentMaster')
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
