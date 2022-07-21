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
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { Team } from '../teams/team.entity';

@ObjectType()
@Entity()
export class TeamMember extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
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

  @Field()
  @Property()
  roleLabel?: string;

  @Field(() => GraphQLISODateTime)
  @Property()
  joinDate = new Date();

  constructor(options: {
    user: User;
    team: Team;
    role: TeamRole;
    roleLabel?: string;
  }) {
    super();
    this.user = options.user;
    this.team = options.team;
    this.role = options.role;
    this.roleLabel = options.roleLabel;
  }
}
