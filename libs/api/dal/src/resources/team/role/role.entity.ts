import { RoleRepository } from './role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Team } from '../team.entity';
import { Entity, Property, ManyToOne, Enum, EnumType, EntityRepositoryType, ArrayType } from '@mikro-orm/core';
import { Colors, TeamRoleType } from '@okampus/shared/enums';

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

  @Enum({ items: () => Colors, type: EnumType })
  color = Colors.Blue;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: null, nullable: true })
  type: TeamRoleType | null = null;

  constructor(options: RoleOptions) {
    super(options);
    this.assign(options);
  }
}
