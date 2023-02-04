import { Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import { Membership } from '../membership.entity';
import type { TeamMemberOptions } from './team-member.options';
import type { Team } from '../../org/team/team.entity';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import { TransformCollection } from '@okampus/api/shards';
import type { TeamAction } from '../../manage-team/team-action/team-action.entity';

import { TeamMemberRepository } from './team-member.repository';

@Entity({ customRepository: () => TeamMemberRepository })
export class TeamMember extends Membership {
  @ManyToOne({ type: 'Team' })
  @TransformCollection()
  team!: Team;

  @ManyToMany({ type: 'TeamRole' })
  @TransformCollection()
  roles = new Collection<TeamRole>(this);

  @OneToMany({ type: 'TeamAction', mappedBy: 'teamMember' })
  @TransformCollection()
  activities = new Collection<TeamAction>(this);

  constructor(options: TeamMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.TeamMember });
    this.assign({ ...options, membershipKind: MembershipKind.TeamMember });
  }
}
