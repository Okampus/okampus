import { TeamJoinsResolver } from './team-joins.resolver';
import { TeamJoinsService } from './team-joins.service';
import { CreateTeamJoinHandler } from './commands/create-team-join/create-team-join.handler';
import { GetTeamJoinByIdHandler } from './queries/get-team-join-by-id/get-team-join-by-id.handler';
import { GetTeamJoinsHandler } from './queries/get-team-joins/get-team-joins.handler';
import { UpdateTeamJoinHandler } from './commands/update-team-join/update-team-join.handler';
import { DeleteTeamJoinHandler } from './commands/delete-team-join/delete-team-join.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateTeamJoinHandler, UpdateTeamJoinHandler, DeleteTeamJoinHandler];
const queryHandlers = [GetTeamJoinByIdHandler, GetTeamJoinsHandler];

@Module({
  imports: [CqrsModule],
  providers: [TeamJoinsResolver, TeamJoinsService, ...commandHandlers, ...queryHandlers],
  exports: [TeamJoinsService],
})
export class TeamJoinsModule {}
