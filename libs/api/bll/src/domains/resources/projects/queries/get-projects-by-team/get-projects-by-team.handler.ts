import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import { PaginatedProjectModel } from '../../../../factories/domains/teams/project.model';
import { GetProjectsByTeamQuery } from './get-projects-by-team.query';

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
