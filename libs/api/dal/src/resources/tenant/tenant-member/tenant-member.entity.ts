import { TenantMemberRepository } from './tenant-member.repository';
import { User } from '../../user/user.entity';
import { TenantScopedEntity } from '../../tenant-scoped.entity';

import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToOne, OneToMany } from '@mikro-orm/core';

import type { TenantMemberOptions } from './tenant-member.options';
import type { TenantMemberRole } from '../tenant-member-role/tenant-member-role.entity';

@Entity({ customRepository: () => TenantMemberRepository })
export class TenantMember extends TenantScopedEntity {
  [EntityRepositoryType]!: TenantMemberRepository;

  @ManyToOne({ type: 'User' })
  user!: User;

  @OneToMany({ type: 'TenantMemberRole', mappedBy: 'tenantMember' })
  @TransformCollection()
  tenantMemberRoles = new Collection<TenantMemberRole>(this);

  constructor(options: TenantMemberOptions) {
    super(options);
    this.assign(options);
  }
}
