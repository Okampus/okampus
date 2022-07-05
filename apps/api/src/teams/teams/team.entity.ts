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
import { Expose } from 'class-transformer';
import { TEAM_FORM_INCLUDED, TEAM_MEMBERS_INCLUDED } from '../../shared/lib/constants';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { User } from '../../users/user.entity';

import type { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';

const ADMIN_ROLES = new Set([TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary]);

@Entity()
export class Team extends BaseEntity {
  @PrimaryKey()
  teamId!: number;

  @Enum(() => TeamKind)
  @Index()
  kind!: TeamKind;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  shortDescription?: string;

  @Property({ type: 'text' })
  longDescription?: string;

  @Property({ type: 'text' })
  category: string;

  @Property()
  tags: string[] = [];

  @Property({ type: 'text' })
  avatar?: string | null;

  @Property({ type: 'text' })
  banner?: string | null;

  @OneToMany(() => TeamMember, member => member.team)
  @TransformCollection()
  @Expose({ groups: [TEAM_MEMBERS_INCLUDED] })
  members = new Collection<TeamMember>(this);

  @Property({ type: 'text' })
  membershipRequestLink?: string;

  @Property({ type: 'text' })
  membershipRequestMessage?: string;

  @OneToOne('TeamForm')
  @Expose({ groups: [TEAM_FORM_INCLUDED] })
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
      .filter(member => member.user.userId === user.userId)
      .map(member => member.role);
  }

  private isTeamAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }
}
