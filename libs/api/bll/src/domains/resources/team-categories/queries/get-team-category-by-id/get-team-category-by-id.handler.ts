import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';
import { GetTeamCategoryByIdQuery } from './get-team-category-by-id.query';

@QueryHandler(GetTeamCategoryByIdQuery)
export class GetTeamCategoryByIdHandler implements IQueryHandler<GetTeamCategoryByIdQuery> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoryByIdQuery): Promise<TeamCategoryModel> {
    return this.teamCategoryFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
