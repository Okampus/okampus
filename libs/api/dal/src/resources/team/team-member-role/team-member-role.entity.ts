import { TeamMemberRepository } from './team-member-role.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Role } from '../role/role.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { TeamMemberRoleOptions } from './team-member-role.options';

@Entity({ customRepository: () => TeamMemberRepository })
export class TeamMemberRole extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamMemberRepository;

  @ManyToOne({ type: 'TeamMember' })
  teamMember!: TeamMember;

  @ManyToOne({ type: 'Role' })
  role!: Role;

  constructor(options: TeamMemberRoleOptions) {
    super(options);
    this.assign(options);
  }
}
