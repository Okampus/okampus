import { TenantOrganizeRepository } from './tenant-organize.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne } from '@mikro-orm/core';
import { TenantOrganizeType } from '@okampus/shared/enums';

import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';
import type { TenantOrganizeOptions } from './tenant-organize.options';
import type { Team } from '../../team/team.entity';

@Entity({ customRepository: () => TenantOrganizeRepository })
export class TenantOrganize extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantOrganizeRepository;

  // TODO: add permission system ?
  @ManyToOne({ type: 'CampusCluster' })
  campusCluster!: CampusCluster;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @Enum({ items: () => TenantOrganizeType, type: EnumType })
  type!: TenantOrganizeType;

  constructor(options: TenantOrganizeOptions) {
    super(options);
    this.assign(options);
  }
}
