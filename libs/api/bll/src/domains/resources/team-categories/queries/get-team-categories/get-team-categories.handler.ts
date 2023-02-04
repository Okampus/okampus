import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import type { PaginatedTeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';
import { GetTeamCategoriesQuery } from './get-team-categories.query';

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
