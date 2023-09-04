import { TenantMemberRepository } from './tenant-member.repository';
import { User } from '../../user/user.entity';
import { BaseEntity } from '../../base.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import type { Tenant } from '../tenant.entity';
import type { TenantMemberOptions } from './tenant-member.options';
import type { TenantMemberRole } from '../tenant-member-role/tenant-member-role.entity';

@Entity({ customRepository: () => TenantMemberRepository })
export class TenantMember extends BaseEntity {
  [EntityRepositoryType]!: TenantMemberRepository;

  @ManyToOne({ type: 'User' })
  user!: User;

  @OneToMany({ type: 'TenantMemberRole', mappedBy: 'tenantMember' })
  @TransformCollection()
  tenantMemberRoles = new Collection<TenantMemberRole>(this);

  @Property({ type: 'int', default: 0 })
  permissions!: number;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  start = new Date();

  @ManyToOne({ type: 'Tenant' })
  tenantScope!: Tenant;

  constructor(options: TenantMemberOptions) {
    super();
    this.assign(options);
  }
}
