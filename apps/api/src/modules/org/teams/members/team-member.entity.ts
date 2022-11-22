/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';
import { TeamRole } from '@meta/shared/lib/types/enums/team-role.enum';
import { User } from '@modules/uua/users/user.entity';
import { Team } from '../team.entity';

@ObjectType()
@Entity()
export class TeamMember extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field(() => TeamRole)
  @Enum(() => TeamRole)
  role!: TeamRole;

  @Field(() => String, { nullable: true })
  @Property()
  roleLabel: string | null = null;

  @Field(() => GraphQLISODateTime)
  @Property()
  joinDate = new Date();

  @Field(() => Int)
  @Property()
  participations = 0;

  @Field(() => Int)
  @Property()
  participationScore = 0;

  @Field(() => Boolean, { defaultValue: true })
  @Property()
  active = true;

  constructor(options: {
    user: User;
    team: Team;
    role: TeamRole;
    roleLabel?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
