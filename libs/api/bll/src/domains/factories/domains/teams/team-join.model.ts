// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { JoinModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TeamRoleModel } from '../../index';

import { Field, ObjectType } from '@nestjs/graphql';

import type { ITeam, ITeamJoin, ITeamRole } from '@okampus/shared/dtos';

const teamField = 'team';
const joinerField = 'joiner';

@ObjectType()
export class TeamJoinModel extends JoinModel implements ITeamJoin {
  @Field(() => TeamModel)
  team!: ITeam;

  @Field(() => TeamRoleModel)
  askedRole!: ITeamRole;

  @Field(() => TeamRoleModel, { nullable: true })
  receivedRole: ITeamRole | null = null;

  constructor(teamJoin: ITeamJoin) {
    super(teamJoin);
    this.assign(teamJoin);
  }
}

@ObjectType()
export class PaginatedTeamJoinModel extends Paginated(TeamJoinModel) {}

export function getTeamJoinPopulate(populate: string[]): { team: never[]; joiner: never[] } {
  const teamPopulate = (populate
    ?.filter((str: string) => str.startsWith(`${teamField}.`))
    ?.map((str: string) => str.replace(`${teamField}.`, '')) ?? ['joins']) as never[];

  const joinerPopulate = (populate
    ?.filter((str: string) => str.startsWith(`${joinerField}.`))
    ?.map((str: string) => str.replace(`${joinerField}.`, '')) ?? ['teamJoins']) as never[];

  return { team: teamPopulate, joiner: joinerPopulate };
}
