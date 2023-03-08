import { GetTeamsQuery } from './get-teams.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedTeamModel } from '../../../../factories/domains/teams/team.model';

@QueryHandler(GetTeamsQuery)
export class GetTeamsHandler implements IQueryHandler<GetTeamsQuery> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(query: GetTeamsQuery): Promise<PaginatedTeamModel> {
    return await this.teamFactory.findWithPagination(
      query.paginationOptions,
      {
        tenant: { id: query.tenant.id },
        ...(query.filterQuery?.types?.length ? { type: { $in: query.filterQuery.types } } : {}),
        ...(query.filterQuery?.categories?.length
          ? { categories: { slug: { $in: query.filterQuery.categories } } }
          : {}),
      },
      { populate: query.populate }
    );
  }
}
