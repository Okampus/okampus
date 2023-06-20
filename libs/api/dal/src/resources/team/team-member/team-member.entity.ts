import { TeamMemberRepository } from './team-member.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';

import type { User } from '../../individual/user/user.entity';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamMemberOptions } from './team-member.options';

@Entity({ customRepository: () => TeamMemberRepository })
export class TeamMember extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamMemberRepository;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToMany({ type: 'Role' })
  @TransformCollection()
  roles = new Collection<Role>(this);

  @Property({ type: 'int', default: 0 })
  permissions!: number;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  startDate = new Date();

  @Property({ type: 'datetime', nullable: true, default: null })
  endDate: Date | null = null;

  constructor(options: TeamMemberOptions) {
    super(options);
    this.assign(options);
  }
}
