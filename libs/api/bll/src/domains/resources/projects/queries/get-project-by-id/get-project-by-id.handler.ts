import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import { ProjectModel } from '../../../../factories/domains/teams/project.model';
import { GetProjectByIdQuery } from './get-project-by-id.query';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(query: GetProjectByIdQuery): Promise<ProjectModel> {
    return this.projectFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
