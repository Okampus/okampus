import { GetTeamByIdQuery } from './get-team-by-id.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { TeamFactory } from '../../../../factories/domains/teams/team.factory';
import type { TeamModel } from '../../../../factories/domains/teams/team.model';

@QueryHandler(GetTeamByIdQuery)
export class GetTeamByIdHandler implements IQueryHandler<GetTeamByIdQuery> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(query: GetTeamByIdQuery): Promise<TeamModel> {
    return this.teamFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
