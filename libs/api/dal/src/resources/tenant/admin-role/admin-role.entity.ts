// eslint-disable-next-line import/no-cycle
import { AdminRoleRepository } from './admin-role.repository';
import { BaseEntity } from '../../base.entity';
import { ArrayType, Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { User } from '../../user/user.entity';
import type { AdminRoleOptions } from './admin-role.options';
import type { Tenant } from '../tenant.entity';

@Entity({ customRepository: () => AdminRoleRepository })
export class AdminRole extends BaseEntity {
  [EntityRepositoryType]!: AdminRoleRepository;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToOne({ type: 'Tenant', nullable: true, default: null })
  tenant: Tenant | null = null;

  @Property({ type: new ArrayType((i) => +i), default: [] })
  permissions: number[] = [];

  constructor(options: AdminRoleOptions) {
    super();
    this.assign(options);
  }
}
