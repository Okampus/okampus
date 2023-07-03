// eslint-disable-next-line import/no-cycle
import { AdminRoleRepository } from './admin-role.repository';
import { BaseEntity } from '../../base.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { Individual } from '../../individual/individual.entity';
import type { AdminRoleOptions } from './admin-role.options';
import type { Tenant } from '../tenant.entity';

@Entity({ customRepository: () => AdminRoleRepository })
export class AdminRole extends BaseEntity {
  [EntityRepositoryType]!: AdminRoleRepository;

  @ManyToOne({ type: 'Individual' })
  individual!: Individual;

  @ManyToOne({ type: 'Tenant', nullable: true, default: null })
  tenant: Tenant | null = null;

  @Property({ type: 'array', default: [] })
  permissions: number[] = [];

  constructor(options: AdminRoleOptions) {
    super();
    this.assign(options);
  }
}
