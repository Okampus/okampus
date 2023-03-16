import { GetTeamJoinsQuery } from './get-team-joins.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinFactory } from '../../../../factories/domains/teams/team-join.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { PaginatedTeamJoinModel } from '../../../../factories/domains/teams/team-join.model';
import type { IQueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetTeamJoinsQuery)
export class GetTeamJoinsHandler implements IQueryHandler<GetTeamJoinsQuery> {
  constructor(private readonly teamJoins: TeamJoinFactory) {}

  async execute(query: GetTeamJoinsQuery): Promise<PaginatedTeamJoinModel> {
    return await this.teamJoins.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
