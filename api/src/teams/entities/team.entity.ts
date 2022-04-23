import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { TEAM_MEMBERS_INCLUDED } from '../../shared/lib/constants';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { User } from '../../users/user.entity';
import { TeamMember } from './team-member.entity';

const ADMIN_ROLES = new Set([TeamRole.Owner, TeamRole.Leader]);

@Entity()
export class Team extends BaseEntity {
  @PrimaryKey()
  teamId!: number;

  @Enum(() => TeamKind)
  kind!: TeamKind;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description?: string;

  @Property({ type: 'text' })
  avatar?: string | null;

  @OneToMany(() => TeamMember, member => member.team)
  @TransformCollection()
  @Expose({ groups: [TEAM_MEMBERS_INCLUDED] })
  members = new Collection<TeamMember>(this);

  constructor(options: {
    name: string;
    kind: TeamKind;
    description?: string;
    avatar?: string;
  }) {
    super();
    this.name = options.name;
    this.kind = options.kind;
    if (options.description)
      this.description = options.description;
    if (options.avatar)
      this.avatar = options.avatar;
  }

  public getMemberRoles(user: User): TeamRole[] {
    return this.members
      .getItems()
      .filter(member => member.user.userId === user.userId)
      .map(member => member.role);
  }

  public isTeamAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }

  public isGlobalAdmin(user: User): boolean {
    return user.roles.includes(Role.Admin) || (this.kind === TeamKind.Club && user.roles.includes(Role.ClubManager));
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
}
