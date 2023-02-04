import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';
import { GetProjectByIdQuery } from './get-project-by-id.query';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(query: GetProjectByIdQuery): Promise<ProjectModel> {
    return this.projectFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
