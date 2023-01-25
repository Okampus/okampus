import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TeamFactory } from '../../../../factories/teams/team.factory';
import { TeamModel } from '../../../../factories/teams/team.model';
import { GetTeamBySlugQuery } from './get-team-by-slug.query';

@QueryHandler(GetTeamBySlugQuery)
export class GetTeamBySlugHandler implements IQueryHandler<GetTeamBySlugQuery> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(query: GetTeamBySlugQuery): Promise<TeamModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return this.teamFactory.findOneOrFail(where, { populate: query.populate });
  }
}
