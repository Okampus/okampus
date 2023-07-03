import { TenantManageRepository } from './tenant.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne } from '@mikro-orm/core';
import { TenantManageType } from '@okampus/shared/enums';

import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';
import type { TenantManageOptions } from './tenant-manage.options';
import type { Team } from '../../team/team.entity';

@Entity({ customRepository: () => TenantManageRepository })
export class TenantManage extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantManageRepository;

  // TODO: add permission system ?
  @ManyToOne({ type: 'CampusCluster', nullable: true, default: null })
  campusCluster: CampusCluster | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @Enum({ items: () => TenantManageType, type: EnumType })
  type!: TenantManageType;

  constructor(options: TenantManageOptions) {
    super(options);
    this.assign(options);
  }
}
