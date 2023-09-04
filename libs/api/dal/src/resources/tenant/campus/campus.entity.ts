// eslint-disable-next-line import/no-cycle
import { CampusRepository } from './campus.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { CampusOptions } from './campus.options';
import type { CampusCluster } from '../campus-cluster/campus-cluster.entity';
import type { Location } from '../../location/location.entity';

@Entity({ customRepository: () => CampusRepository })
export class Campus extends TenantScopedEntity {
  [EntityRepositoryType]!: CampusRepository;

  @Property({ type: 'text' })
  name!: string;

  @ManyToOne({ type: 'Location' })
  location!: Location;

  @ManyToOne({ type: 'CampusCluster' })
  campusCluster!: CampusCluster;

  // TODO: add campus pictures, etc.

  constructor(options: CampusOptions) {
    super(options);
    this.assign(options);
  }
}
