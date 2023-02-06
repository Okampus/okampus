import { GetProjectByIdQuery } from './get-project-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(query: GetProjectByIdQuery): Promise<ProjectModel> {
    return this.projectFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
