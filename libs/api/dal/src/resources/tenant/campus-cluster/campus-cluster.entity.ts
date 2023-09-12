// eslint-disable-next-line import/no-cycle
import { CampusClusterRepository } from './campus-cluster.repository';
import { TenantScopedHiddableEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, EntityRepositoryType, OneToMany, Property } from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';

import type { Campus } from '../campus/campus.entity';
import type { CampusClusterOptions } from './campus-cluster.options';

@Entity({ customRepository: () => CampusClusterRepository })
export class CampusCluster extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: CampusClusterRepository;

  @Property({ type: 'text' })
  name!: string;

  @OneToMany({ type: 'Campus', mappedBy: 'campusCluster' })
  @TransformCollection()
  campuses = new Collection<Campus>(this);

  constructor(options: CampusClusterOptions) {
    super(options);
    this.assign(options);
  }
}
