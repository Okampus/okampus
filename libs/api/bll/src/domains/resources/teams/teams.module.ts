import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Bot } from '@okampus/api/dal';
import { CreateTeamHandler } from './commands/create-team/create-team.handler';
import { GetTeamByIdHandler } from './queries/get-team-by-id/get-team-by-id.handler';
import { GetTeamsHandler } from './queries/get-teams/get-teams.handler';
import { UpdateTeamHandler } from './commands/update-team/update-team.handler';
import { DeleteTeamHandler } from './commands/delete-team/delete-team.handler';
import { GetTeamBySlugHandler } from './queries/get-team-by-slug/get-team-by-slug.handler';

const commandHandlers = [CreateTeamHandler, UpdateTeamHandler, DeleteTeamHandler];
const queryHandlers = [GetTeamByIdHandler, GetTeamsHandler, GetTeamBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Bot, Actor])],
  providers: [TeamsResolver, TeamsService, ...commandHandlers, ...queryHandlers],
  exports: [TeamsService],
})
export class TeamsModule {}
