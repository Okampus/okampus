import { GetProjectsByTeamQuery } from './get-projects-by-team.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedProjectModel } from '../../../../factories/domains/teams/project.model';

@QueryHandler(GetProjectsByTeamQuery)
export class GetProjectsByTeamHandler implements IQueryHandler<GetProjectsByTeamQuery> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(query: GetProjectsByTeamQuery): Promise<PaginatedProjectModel> {
    // TODO: throw error if team does not exist
    return await this.projectFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id }, team: { id: query.teamId } },
      { populate: query.populate }
    );
  }
}
