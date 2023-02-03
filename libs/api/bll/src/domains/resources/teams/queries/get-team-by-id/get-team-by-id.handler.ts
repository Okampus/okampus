import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';
import { TeamModel } from '../../../../factories/domains/teams/team.model';
import { GetTeamByIdQuery } from './get-team-by-id.query';

@QueryHandler(GetTeamByIdQuery)
export class GetTeamByIdHandler implements IQueryHandler<GetTeamByIdQuery> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(query: GetTeamByIdQuery): Promise<TeamModel> {
    return this.teamFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
