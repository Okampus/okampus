import { TeamRoleRepository } from './team-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Team } from '../team.entity';
import { Entity, Property, ManyToOne, Enum, EnumType, EntityRepositoryType } from '@mikro-orm/core';
import { Colors, TeamRoleType } from '@okampus/shared/enums';

import type { TeamRoleOptions } from './team-role.options';
import type { User } from '../../user/user.entity';

@Entity({ customRepository: () => TeamRoleRepository })
export class TeamRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamRoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @ManyToOne({ type: 'Team', inversedBy: 'teamRoles' })
  team!: Team;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  manager: User | null = null;

  @Enum({ items: () => Colors, type: EnumType })
  color = Colors.Blue;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: null, nullable: true })
  type: TeamRoleType | null = null;

  @Property({ type: 'boolean', default: false })
  isPole = false;

  @Property({ type: 'boolean', default: false })
  canManageProfile = false;

  @Property({ type: 'boolean', default: false })
  canViewTreasury = false;

  @Property({ type: 'boolean', default: false })
  canManageTreasury = false;

  @Property({ type: 'boolean', default: false })
  canViewJoins = false;

  @Property({ type: 'boolean', default: false })
  canManageJoins = false;

  @Property({ type: 'boolean', default: false })
  canManageMemberRoles = false;

  @Property({ type: 'boolean', default: false })
  canManageRoles = false;

  @Property({ type: 'boolean', default: false })
  canCreateEvents = false;

  @Property({ type: 'boolean', default: false })
  canManageEvents = false;

  @Property({ type: 'boolean', default: false })
  canViewDraftEvents = false;

  @Property({ type: 'boolean', default: false })
  canCreateActions = false;

  @Property({ type: 'boolean', default: false })
  canManageActions = false;

  @Property({ type: 'boolean', default: false })
  canCreateContents = false;

  @Property({ type: 'boolean', default: false })
  canManageContents = false;

  constructor(options: TeamRoleOptions) {
    super(options);
    this.assign(options);
  }
}
