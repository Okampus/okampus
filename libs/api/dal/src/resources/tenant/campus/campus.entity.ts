// eslint-disable-next-line import/no-cycle
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, OneToOne, Property } from '@mikro-orm/core';

import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';
import type { CampusOptions } from './campus.options';

@Entity()
export class Campus extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @OneToOne({ type: 'ActorAddress', mappedBy: 'campus' })
  address!: ActorAddress;

  // TODO: add campus pictures, etc.

  constructor(options: CampusOptions) {
    super(options);
    this.assign(options);
  }
}
