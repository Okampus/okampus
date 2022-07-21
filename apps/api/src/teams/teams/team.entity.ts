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

  @Field()
  @Property({ type: 'text' })
  shortDescription?: string;

  @Field()
  @Property({ type: 'text' })
  longDescription?: string;

  @Field()
  @Property({ type: 'text' })
  category: string;

  @Field(() => [String])
  @Property()
  tags: string[] = [];

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  banner?: string | null;

  @Field(() => [TeamMember])
  @OneToMany('TeamMember', 'team')
  @TransformCollection()
  members = new Collection<TeamMember>(this);

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  membershipRequestLink?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  membershipRequestMessage?: string;

  @Field(() => TeamForm, { nullable: true })
  @OneToOne('TeamForm')
  membershipRequestForm?: TeamForm | null;

  constructor(options: {
    name: string;
    kind: TeamKind;
    category: string;
    shortDescription?: string;
    longDescription?: string;
    avatar?: string;
    banner?: string;
    tags?: string[];
    membershipRequestLink?: string;
    membershipRequestMessage?: string;
    membershipRequestForm?: TeamForm;
  }) {
    super();
    this.name = options.name;
    this.kind = options.kind;
    this.category = options.category;
    if (options.shortDescription)
      this.shortDescription = options.shortDescription;
    if (options.longDescription)
      this.longDescription = options.longDescription;
    if (options.avatar)
      this.avatar = options.avatar;
    if (options.banner)
      this.banner = options.banner;
    console.log('DEBUG ~ file: team.entity.ts ~ line 109 ~ options.tags', options.tags);
    if (options.tags)
      this.tags = options.tags;
    if (options.membershipRequestLink)
      this.membershipRequestLink = options.membershipRequestLink;
    if (options.membershipRequestMessage)
      this.membershipRequestMessage = options.membershipRequestMessage;
    if (options.membershipRequestForm)
      this.membershipRequestForm = options.membershipRequestForm;
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
