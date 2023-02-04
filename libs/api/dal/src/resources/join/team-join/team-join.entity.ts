import { Entity, ManyToOne } from '@mikro-orm/core';
import { Join } from '../join.entity';
import { JoinKind } from '@okampus/shared/enums';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import type { TeamJoinOptions } from './team-join.options';
import type { Team } from '../../org/team/team.entity';

@Entity()
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
