import { GetTeamCategoryByIdQuery } from './get-team-category-by-id.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import type { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';

@QueryHandler(GetTeamCategoryByIdQuery)
export class GetTeamCategoryByIdHandler implements IQueryHandler<GetTeamCategoryByIdQuery> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(query: GetTeamCategoryByIdQuery): Promise<TeamCategoryModel> {
    return this.teamCategoryFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
