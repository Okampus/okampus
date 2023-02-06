import { TeamRoleRepository } from './team-role.repository';
import { Role } from '../role.entity';
import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { RoleKind, TeamRoleCategory, TeamRoleKey } from '@okampus/shared/enums';
import { TeamPermissions } from '@okampus/shared/enums';
import type { TeamRoleOptions } from './team-role.options';
import type { Team } from '../../org/team/team.entity';

@Entity({ customRepository: () => TeamRoleRepository })
export class TeamRole extends Role {
  @ManyToOne({ type: 'Team', inversedBy: 'roles' })
  team!: Team;

  @Enum({ items: () => TeamPermissions, type: 'string', default: [], array: true })
  permissions: TeamPermissions[] = [];

  @Enum({ items: () => TeamRoleCategory, type: 'string' })
  category!: TeamRoleCategory;

  @Enum({ items: () => TeamRoleKey, type: 'string', nullable: true })
  key: TeamRoleKey | null = null;

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
