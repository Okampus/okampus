import { TeamRoleRepository } from './team-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Team } from '../team.entity';
import { Entity, Property, ManyToOne, Enum, EnumType, EntityRepositoryType, ArrayType } from '@mikro-orm/core';
import { Colors, TeamRoleType } from '@okampus/shared/enums';

import type { TeamRoleOptions } from './team-role.options';

@Entity({ customRepository: () => TeamRoleRepository })
export class TeamRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamRoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: new ArrayType((i) => +i), default: [] })
  permissions: number[] = [];

  @ManyToOne({ type: 'Team', inversedBy: 'teamRoles' })
  team!: Team;

  @Enum({ items: () => Colors, type: EnumType })
  color = Colors.Blue;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: null, nullable: true })
  type: TeamRoleType | null = null;

  constructor(options: TeamRoleOptions) {
    super(options);
    this.assign(options);
  }
}
