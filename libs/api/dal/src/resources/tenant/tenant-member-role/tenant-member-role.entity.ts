import { TenantMemberRoleRepository } from './tenant-member-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { TenantMemberRoleOptions } from './tenant-member-role.options';
import type { TenantRole } from '../tenant-role/tenant-role.entity';
import type { TenantMember } from '../tenant-member/tenant-member.entity';

@Entity({ customRepository: () => TenantMemberRoleRepository })
export class TenantMemberRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantMemberRoleRepository;

  @ManyToOne({ type: 'TenantMember' })
  tenantMember!: TenantMember;

  @ManyToOne({ type: 'TenantRole' })
  tenantRole!: TenantRole;

  constructor(options: TenantMemberRoleOptions) {
    super(options);
    this.assign(options);
  }
}
