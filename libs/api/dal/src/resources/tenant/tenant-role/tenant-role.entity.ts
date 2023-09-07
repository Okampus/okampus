import { TenantRoleRepository } from './tenant-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, EnumType, EntityRepositoryType } from '@mikro-orm/core';
import { Colors, TeamRoleType } from '@okampus/shared/enums';

import type { TenantRoleOptions } from './tenant-role.options';

@Entity({ customRepository: () => TenantRoleRepository })
export class TenantRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantRoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @Enum({ items: () => Colors, type: EnumType })
  color = Colors.Blue;

  @Enum({ items: () => TeamRoleType, type: EnumType, default: null, nullable: true })
  type: TeamRoleType | null = null;

  @Property({ type: 'boolean', default: false })
  canViewHidden = false;

  @Property({ type: 'boolean', default: false })
  canHide = false;

  @Property({ type: 'boolean', default: false })
  canCreateTeam = false;

  @Property({ type: 'boolean', default: false })
  canManageCampus = false;

  @Property({ type: 'boolean', default: false })
  canManageEventApprovalSteps = false;

  @Property({ type: 'boolean', default: false })
  canManageEventApprovals = false;

  constructor(options: TenantRoleOptions) {
    super(options);
    this.assign(options);
  }
}
