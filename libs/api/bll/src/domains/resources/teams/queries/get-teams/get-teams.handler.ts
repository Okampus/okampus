import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TeamFactory } from '../../../../factories/teams/team.factory';
import { PaginatedTeamModel } from '../../../../factories/teams/team.model';
import { GetTeamsQuery } from './get-teams.query';

@QueryHandler(GetTeamsQuery)
export class GetTeamsHandler implements IQueryHandler<GetTeamsQuery> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(query: GetTeamsQuery): Promise<PaginatedTeamModel> {
    return await this.teamFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
