import { GetTeamCategoriesQuery } from './get-team-categories.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import type { PaginatedTeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';

@QueryHandler(GetTeamCategoriesQuery)
export class GetTeamCategoriesHandler implements IQueryHandler<GetTeamCategoriesQuery> {
  constructor(private readonly teamCategories: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoriesQuery): Promise<PaginatedTeamCategoryModel> {
    return await this.teamCategories.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
