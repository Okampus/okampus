import { GetTeamCategoryByIdQuery } from './get-team-category-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';

@QueryHandler(GetTeamCategoryByIdQuery)
export class GetTeamCategoryByIdHandler implements IQueryHandler<GetTeamCategoryByIdQuery> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoryByIdQuery): Promise<TeamCategoryModel> {
    return this.teamCategoryFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
