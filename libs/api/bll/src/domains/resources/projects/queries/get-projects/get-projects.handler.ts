import { GetProjectsQuery } from './get-projects.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import type { PaginatedProjectModel } from '../../../../factories/domains/teams/project.model';

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
