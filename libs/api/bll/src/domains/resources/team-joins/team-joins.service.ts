import { CreateTeamJoinCommand } from './commands/create-team-join/create-team-join.command';
import { DeleteTeamJoinCommand } from './commands/delete-team-join/delete-team-join.command';
import { UpdateTeamJoinCommand } from './commands/update-team-join/update-team-join.command';
import { GetTeamJoinsQuery } from './queries/get-team-joins/get-team-joins.query';
import { GetTeamJoinByIdQuery } from './queries/get-team-join-by-id/get-team-join-by-id.query';
import { RequestContext } from '../../../shards/abstract/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateTeamJoinDto, UpdateTeamJoinDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { PaginatedTeamJoinModel, TeamJoinModel } from '../../factories/domains/teams/team-join.model';

const defaultTeamJoinPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class TeamJoinsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<TeamJoinModel> {
    const query = new GetTeamJoinByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultTeamJoinPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTeamJoinModel> {
    const query = new GetTeamJoinsQuery(
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultTeamJoinPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createTeamJoin: CreateTeamJoinDto): Promise<TeamJoinModel> {
    const command = new CreateTeamJoinCommand(createTeamJoin, this.tenant(), this.requester(), this.autoGqlPopulate());
    return this.commandBus.execute(command);
  }

  update(updateTeamJoin: UpdateTeamJoinDto): Promise<TeamJoinModel> {
    const command = new UpdateTeamJoinCommand(
      updateTeamJoin,
      this.requester(),
      this.tenant(),
      this.autoGqlPopulate(defaultTeamJoinPopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteTeamJoinCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
