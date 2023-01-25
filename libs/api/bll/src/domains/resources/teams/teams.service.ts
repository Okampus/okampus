import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTeamDto, UpdateTeamDto } from '@okampus/shared/dtos';
import { UUID } from '@okampus/shared/types';
import { RequestContext } from '../../../shards/global-request/request-context';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { TeamModel, PaginatedTeamModel } from '../../factories/teams/team.model';
import { CreateTeamCommand } from './commands/create-team/create-team.command';
import { DeleteTeamCommand } from './commands/delete-team/delete-team.command';
import { UpdateTeamCommand } from './commands/update-team/update-team.command';
import { GetTeamByIdQuery } from './queries/get-team-by-id/get-team-by-id.query';
import { GetTeamBySlugQuery } from './queries/get-team-by-slug/get-team-by-slug.query';
import { GetTeamsQuery } from './queries/get-teams/get-teams.query';

const defaultTeamPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class TeamsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: UUID): Promise<TeamModel> {
    const query = new GetTeamByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: UUID): Promise<TeamModel> {
    const query = new GetTeamBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTeamModel> {
    const query = new GetTeamsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  create(createTeam: CreateTeamDto): Promise<TeamModel> {
    const command = new CreateTeamCommand(createTeam, this.tenant());
    return this.commandBus.execute(command);
  }

  update(updateTeam: UpdateTeamDto): Promise<TeamModel> {
    const command = new UpdateTeamCommand(updateTeam, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: UUID) {
    const command = new DeleteTeamCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
