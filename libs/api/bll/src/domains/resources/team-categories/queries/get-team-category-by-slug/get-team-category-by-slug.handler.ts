import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import type { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';
import { GetTeamCategoryBySlugQuery } from './get-team-category-by-slug.query';

@QueryHandler(GetTeamCategoryBySlugQuery)
export class GetTeamCategoryBySlugHandler implements IQueryHandler<GetTeamCategoryBySlugQuery> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoryBySlugQuery): Promise<TeamCategoryModel> {
    return this.teamCategoryFactory.findOneOrFail({ slug: query.slug }, { populate: query.populate });
  }
}
