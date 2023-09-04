import { TenantRoleRepository } from './tenant-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, EnumType, EntityRepositoryType, ArrayType } from '@mikro-orm/core';
import { Colors, TeamRoleType } from '@okampus/shared/enums';

import type { TenantRoleOptions } from './tenant-role.options';

@Entity({ customRepository: () => TenantRoleRepository })
export class TenantRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantRoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: new ArrayType((i) => +i), default: [] })
  permissions: number[] = [];

  @Enum({ items: () => Colors, type: EnumType })
  color = Colors.Blue;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: null, nullable: true })
  type: TeamRoleType | null = null;

  constructor(options: TenantRoleOptions) {
    super(options);
    this.assign(options);
  }
}
