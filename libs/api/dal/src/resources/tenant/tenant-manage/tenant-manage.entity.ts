import { TenantManageRepository } from './tenant.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';
import type { TenantManageOptions } from './tenant-manage.options';
import type { Team } from '../../team/team.entity';

@Entity({ customRepository: () => TenantManageRepository })
export class TenantManage extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantManageRepository;

  @ManyToOne({ type: 'CampusCluster', nullable: true, default: null })
  campusCluster: CampusCluster | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  // TODO: add permission system ?

  constructor(options: TenantManageOptions) {
    super(options);
    this.assign(options);
  }
}
