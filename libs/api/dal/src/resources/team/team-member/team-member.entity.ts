import { TeamMemberRepository } from './team-member.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { User } from '../../individual/user/user.entity';
import { Team } from '../team.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import type { TeamMemberOptions } from './team-member.options';
import type { TeamMemberRole } from '../team-member-role/team-member-role.entity';

@Entity({ customRepository: () => TeamMemberRepository })
export class TeamMember extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamMemberRepository;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'User' })
  user!: User;

  @OneToMany({ type: 'TeamMemberRole', mappedBy: 'teamMember' })
  @TransformCollection()
  teamMemberRoles = new Collection<TeamMemberRole>(this);

  @Property({ type: 'int', default: 0 })
  permissions!: number;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  start = new Date();

  constructor(options: TeamMemberOptions) {
    super(options);
    this.assign(options);
  }
}
