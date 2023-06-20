// eslint-disable-next-line import/no-cycle
import { CampusRepository } from './campus.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, OneToOne, Property } from '@mikro-orm/core';

import type { Address } from '../../actor/address/address.entity';
import type { CampusOptions } from './campus.options';

@Entity({ customRepository: () => CampusRepository })
export class Campus extends TenantScopedEntity {
  [EntityRepositoryType]!: CampusRepository;

  @Property({ type: 'text' })
  name!: string;

  @OneToOne({ type: 'Address', mappedBy: 'campus' })
  address!: Address;

  // TODO: add campus pictures, etc.

  constructor(options: CampusOptions) {
    super(options);
    this.assign(options);
  }
}
