import { RoleRepository } from './role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, ManyToOne, Enum, EnumType, EntityRepositoryType, ArrayType } from '@mikro-orm/core';
import { RoleCategory, TeamRoleType } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { RoleOptions } from './role.options';

@Entity({ customRepository: () => RoleRepository })
export class Role extends TenantScopedEntity {
  [EntityRepositoryType]!: RoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: new ArrayType((i) => +i), default: [] })
  permissions: number[] = [];

  @ManyToOne({ type: 'Team', inversedBy: 'roles' })
  team!: Team;

  @Enum({ items: () => RoleCategory, type: EnumType })
  category!: RoleCategory;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: TeamRoleType.Member })
  type: TeamRoleType = TeamRoleType.Member;

  @Property({ type: 'boolean', default: true })
  isLocked = false;

  constructor(options: RoleOptions) {
    super(options);
    this.assign(options);
  }
}
