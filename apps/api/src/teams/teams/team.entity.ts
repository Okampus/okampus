import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { User } from '../../users/user.entity';

// eslint-disable-next-line import/no-cycle
import { TeamForm } from '../forms/team-form.entity';
// eslint-disable-next-line import/no-cycle
import { TeamMember } from '../members/team-member.entity';

const ADMIN_ROLES = new Set([TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary]);

@ObjectType()
@Entity()
export class Team extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => TeamKind)
  @Enum(() => TeamKind)
  @Index()
  kind!: TeamKind;

  @Field()
  @Property({ type: 'text' })
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  shortDescription: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  longDescription: string | null = null;

  @Field()
  @Property({ type: 'text' })
  category!: string;

  @Field(() => [String])
  @Property()
  tags: string[] = [];

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  avatar: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  banner: string | null = null;

  @Field(() => [TeamMember])
  @OneToMany('TeamMember', 'team')
  @TransformCollection()
  members = new Collection<TeamMember>(this);

  @Field(() => TeamForm, { nullable: true })
  @OneToOne('TeamForm')
  membershipRequestForm: TeamForm | null = null;

  constructor(options: {
    name: string;
    kind: TeamKind;
    category: string;
    shortDescription?: string | null;
    longDescription?: string | null;
    avatar?: string | null;
    banner?: string | null;
    tags?: string[] | null;
    membershipRequestForm?: TeamForm | null;
  }) {
    super();
    this.assign(options);
  }

  public canAdminister(user: User): boolean {
    return this.isGlobalAdmin(user) || this.isTeamAdmin(user);
  }

  public canActOnRole(user: User, role: TeamRole): boolean {
    if (this.isGlobalAdmin(user))
      return true;

    if (!ADMIN_ROLES.has(role))
      return this.isTeamAdmin(user);

    return this.getMemberRoles(user).includes(TeamRole.Owner);
  }

  public isGlobalAdmin(user: User): boolean {
    return user.roles.includes(Role.Admin) || (this.kind === TeamKind.Club && user.roles.includes(Role.ClubManager));
  }

  private getMemberRoles(user: User): TeamRole[] {
    return this.members
      .getItems()
      .filter(member => member.user.id === user.id)
      .map(member => member.role);
  }

  private isTeamAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }
}
