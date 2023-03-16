import { TeamJoinRepository } from './team-join.repository';
import { Join } from '../join.entity';

import { JoinKind } from '@okampus/shared/enums';
import { formatDateDayOfWeek } from '@okampus/shared/utils';

import { Entity, ManyToOne } from '@mikro-orm/core';

import type { Individual } from '../../actor/individual/individual.entity';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import type { TeamJoinOptions } from './team-join.options';
import type { Team } from '../../org/team/team.entity';
import type { User } from '@sentry/node';

@Entity({ customRepository: () => TeamJoinRepository })
export class TeamJoin extends Join {
  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'TeamRole' })
  askedRole!: TeamRole;

  @ManyToOne({ type: 'TeamRole', nullable: true })
  receivedRole: TeamRole | null = null;

  constructor(options: TeamJoinOptions) {
    super({ ...options, joinKind: JoinKind.TeamJoin });
    this.assign({ ...options, joinKind: JoinKind.TeamJoin });
  }
}

export const getTeamJoinDescription = (issuer: Individual | null, joiner: User, role: TeamRole, team: Team): string => {
  const now = formatDateDayOfWeek(new Date());
  const start = issuer
    ? `Invitation de ${joiner.actor.name} de la part de ${issuer.actor.name}`
    : `Adhésion de ${joiner.actor.name}`;

  return `${start} à rejoindre ${team.actor.name} en tant que ${role.name} (${now})`;
};
