import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, ManyToOne, Enum, EnumType } from '@mikro-orm/core';
import { TeamPermissions, RoleCategory, TeamRoleType } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { RoleOptions } from './role.options';

@Entity()
export class Role extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'int', default: TeamPermissions.Default })
  permissions: number = TeamPermissions.Default;

  @ManyToOne({ type: 'Team', inversedBy: 'roles' })
  team!: Team;

  @Enum({ items: () => RoleCategory, type: EnumType })
  category!: RoleCategory;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: TeamRoleType.Member })
  type: TeamRoleType = TeamRoleType.Member;

  @Property({ type: 'boolean' })
  isRequired = false;

  constructor(options: RoleOptions) {
    super(options);
    this.assign(options);
  }
}
