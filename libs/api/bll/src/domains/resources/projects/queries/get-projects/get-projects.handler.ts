import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import { PaginatedProjectModel } from '../../../../factories/domains/teams/project.model';
import { GetProjectsQuery } from './get-projects.query';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(query: GetProjectsQuery): Promise<PaginatedProjectModel> {
    return await this.projectFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
