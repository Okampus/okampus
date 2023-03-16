import { GetTeamJoinByIdQuery } from './get-team-join-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinFactory } from '../../../../factories/domains/teams/team-join.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { TeamJoinModel } from '../../../../factories/domains/teams/team-join.model';

@QueryHandler(GetTeamJoinByIdQuery)
export class GetTeamJoinByIdHandler implements IQueryHandler<GetTeamJoinByIdQuery> {
  constructor(private readonly teamJoinFactory: TeamJoinFactory) {}

  async execute(query: GetTeamJoinByIdQuery): Promise<TeamJoinModel> {
    return this.teamJoinFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
