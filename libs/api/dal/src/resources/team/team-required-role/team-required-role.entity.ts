import { TeamRequiredRoleRepository } from './team-required-role.repository';
import { RequiredRole } from '../../tenant/required-role/required-role.entity';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { TeamRequiredRoleOptions } from './team-required-role.options';

@Entity({ customRepository: () => TeamRequiredRoleRepository })
export class TeamRequiredRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamRequiredRoleRepository;

  @ManyToOne({ type: 'TeamMember' })
  teamMember!: TeamMember;

  @ManyToOne({ type: 'RequiredRole' })
  requiredRole!: RequiredRole;

  constructor(options: TeamRequiredRoleOptions) {
    super(options);
    this.assign(options);
  }
}
