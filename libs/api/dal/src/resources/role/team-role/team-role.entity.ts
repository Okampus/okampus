import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { RoleKind, TeamRoleCategory } from '@okampus/shared/enums';
import { TeamPermissions } from '@okampus/shared/enums';
import { TeamRoleOptions } from './team-role.options';
import { Role } from '../role.entity';
import { Team } from '../../org/team/team.entity';

@Entity()
export class TeamRole extends Role {
  @ManyToOne({ type: 'Team' })
  team!: Team;

  @Enum({ array: true })
  permissions: TeamPermissions[] = [];

  @Enum(() => TeamRoleCategory)
  category!: TeamRoleCategory;

  public isDirector(): boolean {
    return [TeamRoleCategory.Managers, TeamRoleCategory.Directors].includes(this.category);
  }

  public canManage(): boolean {
    return [TeamRoleCategory.Managers, TeamRoleCategory.Directors].includes(this.category);
  }

  constructor(options: TeamRoleOptions) {
    super({ ...options, roleKind: RoleKind.TeamRole });
    this.assign({ ...options, roleKind: RoleKind.TeamRole });
  }
}
