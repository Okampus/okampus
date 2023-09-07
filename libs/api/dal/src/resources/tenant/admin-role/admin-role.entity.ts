// eslint-disable-next-line import/no-cycle
import { AdminRoleRepository } from './admin-role.repository';
import { BaseEntity } from '../../base.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { User } from '../../user/user.entity';
import type { AdminRoleOptions } from './admin-role.options';
import type { Tenant } from '../tenant.entity';

// TODO: add scope for admin roles (one admin role would be permissions for one tenant)
@Entity({ customRepository: () => AdminRoleRepository })
export class AdminRole extends BaseEntity {
  [EntityRepositoryType]!: AdminRoleRepository;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToOne({ type: 'Tenant', nullable: true, default: null })
  tenant: Tenant | null = null;

  @Property({ type: 'boolean', default: false })
  canCreateTenant = false;

  @Property({ type: 'boolean', default: false })
  canManageTenantEntities = false;

  @Property({ type: 'boolean', default: false })
  canDeleteTenantEntities = false;

  constructor(options: AdminRoleOptions) {
    super();
    this.assign(options);
  }
}
