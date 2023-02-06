import { GetTeamCategoryBySlugQuery } from './get-team-category-by-slug.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';

@QueryHandler(GetTeamCategoryBySlugQuery)
export class GetTeamCategoryBySlugHandler implements IQueryHandler<GetTeamCategoryBySlugQuery> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoryBySlugQuery): Promise<TeamCategoryModel> {
    return this.teamCategoryFactory.findOneOrFail({ slug: query.slug }, { populate: query.populate });
  }
}
